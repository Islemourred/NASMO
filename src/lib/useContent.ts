import { useEffect, useState, useCallback } from "react";
import { useLocale } from "next-intl";
import { supabase } from "./supabase";

type ContentMap = Record<string, string>;

interface TranslateItem {
  sourceTable: string;
  sourceId: string;
  fieldName: string;
  text: string;
}

// ---------- Translation helper ----------
async function translateBatch(
  items: TranslateItem[],
  locale: string
): Promise<string[]> {
  if (locale === "en" || items.length === 0) {
    return items.map((i) => i.text);
  }

  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, locale }),
    });
    if (!res.ok) return items.map((i) => i.text);
    const { translations } = await res.json();
    return translations;
  } catch {
    return items.map((i) => i.text);
  }
}

// ---------- useSiteContent (single section) ----------
export function useSiteContent(section: string): {
  content: ContentMap;
  loading: boolean;
} {
  const locale = useLocale();
  const [content, setContent] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("site_content")
      .select("key, value")
      .eq("section", section)
      .order("sort_order")
      .then(async ({ data }) => {
        if (data && data.length > 0) {
          const map: ContentMap = {};
          data.forEach((d) => {
            map[d.key] = d.value;
          });

          if (locale !== "en") {
            // Build translation items
            const items: TranslateItem[] = data
              .filter((d) => d.value.trim() !== "")
              .map((d) => ({
                sourceTable: "site_content",
                sourceId: `${section}:${d.key}`,
                fieldName: "value",
                text: d.value,
              }));

            const translations = await translateBatch(items, locale);
            let idx = 0;
            data.forEach((d) => {
              if (d.value.trim() !== "") {
                map[d.key] = translations[idx++];
              }
            });
          }

          setContent(map);
        }
        setLoading(false);
      });
  }, [section, locale]);

  return { content, loading };
}

// ---------- useMultiSiteContent (multiple sections) ----------
export function useMultiSiteContent(sections: string[]): {
  content: Record<string, ContentMap>;
  loading: boolean;
} {
  const locale = useLocale();
  const [content, setContent] = useState<Record<string, ContentMap>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("site_content")
      .select("section, key, value")
      .in("section", sections)
      .order("sort_order")
      .then(async ({ data }) => {
        if (data && data.length > 0) {
          const map: Record<string, ContentMap> = {};
          data.forEach((d) => {
            if (!map[d.section]) map[d.section] = {};
            map[d.section][d.key] = d.value;
          });

          if (locale !== "en") {
            const items: TranslateItem[] = data
              .filter((d) => d.value.trim() !== "")
              .map((d) => ({
                sourceTable: "site_content",
                sourceId: `${d.section}:${d.key}`,
                fieldName: "value",
                text: d.value,
              }));

            const translations = await translateBatch(items, locale);
            let idx = 0;
            data.forEach((d) => {
              if (d.value.trim() !== "") {
                if (!map[d.section]) map[d.section] = {};
                map[d.section][d.key] = translations[idx++];
              }
            });
          }

          setContent(map);
        }
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections.join(","), locale]);

  return { content, loading };
}

// ---------- useTranslatedData (for services, products, etc.) ----------
export function useTranslatedData<T extends Record<string, any>>(
  table: string,
  fields: string[], // fields to translate e.g. ['title', 'description']
  queryFn: () => Promise<T[]>
): { data: T[]; loading: boolean } {
  const locale = useLocale();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const stableQueryFn = useCallback(queryFn, [table]);

  useEffect(() => {
    stableQueryFn().then(async (rows) => {
      if (rows.length === 0) {
        setData([]);
        setLoading(false);
        return;
      }

      if (locale !== "en") {
        // Build translation items for all translatable fields
        const items: TranslateItem[] = [];
        const itemMap: { rowIdx: number; field: string }[] = [];

        rows.forEach((row, rowIdx) => {
          fields.forEach((field) => {
            const val = row[field];
            if (typeof val === "string" && val.trim() !== "") {
              items.push({
                sourceTable: table,
                sourceId: row.id || row.slug || `${rowIdx}`,
                fieldName: field,
                text: val,
              });
              itemMap.push({ rowIdx, field });
            }
          });
        });

        if (items.length > 0) {
          const translations = await translateBatch(items, locale);
          const translatedRows = rows.map((r) => ({ ...r }));
          translations.forEach((t, i) => {
            const { rowIdx, field } = itemMap[i];
            (translatedRows[rowIdx] as any)[field] = t;
          });
          setData(translatedRows);
          setLoading(false);
          return;
        }
      }

      setData(rows);
      setLoading(false);
    });
  }, [stableQueryFn, locale, fields.join(","), table]);

  return { data, loading };
}
