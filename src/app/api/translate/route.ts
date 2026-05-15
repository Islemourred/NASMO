import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LANG_NAMES: Record<string, string> = {
  fr: "French",
  ar: "Arabic",
};

// Simple hash function for detecting content changes
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString(36);
}

interface TranslateItem {
  sourceTable: string;
  sourceId: string;
  fieldName: string;
  text: string;
}

export async function POST(request: NextRequest) {
  try {
    const { items, locale }: { items: TranslateItem[]; locale: string } = await request.json();

    if (!locale || locale === "en") {
      return NextResponse.json({ translations: items.map(i => i.text) });
    }

    if (!LANG_NAMES[locale]) {
      return NextResponse.json({ error: "Unsupported locale" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      // Fallback: return original text if no API key
      return NextResponse.json({ translations: items.map(i => i.text) });
    }

    // Check cache for all items
    const results: string[] = new Array(items.length);
    const toTranslate: { index: number; item: TranslateItem; hash: string }[] = [];

    // Build cache lookup
    const cacheKeys = items.map(i => `${i.sourceTable}:${i.sourceId}:${i.fieldName}`);
    const { data: cached } = await supabase
      .from("content_translations")
      .select("source_table, source_id, field_name, original_hash, translated_text")
      .eq("locale", locale)
      .in("source_table", [...new Set(items.map(i => i.sourceTable))]);

    // Build a lookup map from cache
    const cacheMap = new Map<string, { hash: string; text: string }>();
    if (cached) {
      for (const row of cached) {
        const key = `${row.source_table}:${row.source_id}:${row.field_name}`;
        cacheMap.set(key, { hash: row.original_hash, text: row.translated_text });
      }
    }

    // Check each item against cache
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const hash = simpleHash(item.text);
      const cacheKey = cacheKeys[i];
      const entry = cacheMap.get(cacheKey);

      if (entry && entry.hash === hash) {
        // Cache hit with same content
        results[i] = entry.text;
      } else if (item.text.trim() === "") {
        results[i] = "";
      } else {
        toTranslate.push({ index: i, item, hash });
      }
    }

    // If everything was cached, return immediately
    if (toTranslate.length === 0) {
      return NextResponse.json({ translations: results });
    }

    // Batch translate using Groq
    const textsToTranslate = toTranslate.map((t, i) => `[${i}] ${t.item.text}`).join("\n");
    const targetLang = LANG_NAMES[locale];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the following texts from English to ${targetLang}. Each text is prefixed with [number]. Return ONLY the translations in the same format [number] translated_text, one per line. Do not add explanations. Keep the tone professional and appropriate for a corporate website about heavy equipment maintenance services.${locale === "ar" ? " Use Modern Standard Arabic." : ""}`,
          },
          { role: "user", content: textsToTranslate },
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error("Groq translation error:", response.status);
      // Fallback: return original texts
      for (const t of toTranslate) {
        results[t.index] = t.item.text;
      }
      return NextResponse.json({ translations: results });
    }

    const data = await response.json();
    const translatedRaw = data.choices?.[0]?.message?.content || "";

    // Parse the response
    const lines = translatedRaw.split("\n").filter((l: string) => l.trim());
    const parsed = new Map<number, string>();
    for (const line of lines) {
      const match = line.match(/^\[(\d+)\]\s*(.+)$/);
      if (match) {
        parsed.set(parseInt(match[1]), match[2].trim());
      }
    }

    // Apply translations and prepare cache upserts
    const upserts: {
      source_table: string;
      source_id: string;
      field_name: string;
      locale: string;
      original_hash: string;
      translated_text: string;
      updated_at: string;
    }[] = [];

    for (let i = 0; i < toTranslate.length; i++) {
      const t = toTranslate[i];
      const translated = parsed.get(i) || t.item.text;
      results[t.index] = translated;

      upserts.push({
        source_table: t.item.sourceTable,
        source_id: t.item.sourceId,
        field_name: t.item.fieldName,
        locale,
        original_hash: t.hash,
        translated_text: translated,
        updated_at: new Date().toISOString(),
      });
    }

    // Save to cache (don't await — fire and forget)
    if (upserts.length > 0) {
      supabase
        .from("content_translations")
        .upsert(upserts, { onConflict: "source_table,source_id,field_name,locale" })
        .then(({ error }) => {
          if (error) console.error("Cache upsert error:", error);
        });
    }

    return NextResponse.json({ translations: results });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
