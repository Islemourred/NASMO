"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface ContentField {
  id: string;
  section: string;
  key: string;
  value: string;
  label: string;
  field_type: string;
  sort_order: number;
}

interface Section {
  id: string;
  label: string;
  fields: ContentField[];
}

export default function ContentAdminPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .order("sort_order");

      if (error || !data) return;

      // Group by section
      const sectionMap = new Map<string, ContentField[]>();
      data.forEach((item: ContentField) => {
        const existing = sectionMap.get(item.section) ?? [];
        existing.push(item);
        sectionMap.set(item.section, existing);
      });

      const sectionLabels: Record<string, string> = {
        hero: "Hero / Banner",
        about: "About",
        stats: "Statistics",
        contact: "Contact",
      };

      const grouped: Section[] = Array.from(sectionMap.entries()).map(([id, fields]) => ({
        id,
        label: sectionLabels[id] || id,
        fields,
      }));

      setSections(grouped);
      if (grouped.length > 0 && !grouped.find(s => s.id === activeSection)) {
        setActiveSection(grouped[0].id);
      }
      setLoading(false);
    };
    fetchContent();
  }, [activeSection]);

  const updateField = (fieldId: string, value: string) => {
    setSections(sections.map(s => ({
      ...s,
      fields: s.fields.map(f => f.id === fieldId ? { ...f, value } : f),
    })));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const current = sections.find(s => s.id === activeSection);
    if (!current) return;

    const updates = current.fields.map(f =>
      supabase.from("site_content").update({ value: f.value }).eq("id", f.id)
    );

    await Promise.all(updates);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const current = sections.find(s => s.id === activeSection);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="w-6 h-6 animate-spin text-orange" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">Contenu</h1>
          <p className="text-txtmuted text-[.84rem] mt-1">Modifiez le contenu de votre site</p>
        </div>
        <button onClick={handleSave} disabled={saving} className={`btn text-[.8rem] ${saved ? "bg-green-500/10 text-green-400 border-green-500/20" : "btn-primary"}`}>
          {saved ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Sauvegardé !
            </>
          ) : saving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sauvegarde...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              Sauvegarder
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Section nav */}
        <div className="lg:col-span-1">
          <div className="card p-2 space-y-1">
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[.82rem] font-medium transition-all ${
                  activeSection === s.id
                    ? "bg-orange/10 text-orange border border-orange/15"
                    : "text-txtsec hover:bg-[var(--bg-alt)] border border-transparent"
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fields */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            <h3 className="font-bold text-[var(--text-primary)] text-[1rem] mb-5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange" />
              {current?.label}
            </h3>
            <div className="space-y-5">
              {current?.fields.map(f => (
                <div key={f.id}>
                  <label className="block text-txtsec text-[.7rem] font-semibold uppercase tracking-wider mb-2">{f.label}</label>
                  {f.field_type === "textarea" ? (
                    <textarea className="input resize-none" rows={3} value={f.value}
                      onChange={e => updateField(f.id, e.target.value)} />
                  ) : (
                    <input className="input" value={f.value}
                      onChange={e => updateField(f.id, e.target.value)} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
