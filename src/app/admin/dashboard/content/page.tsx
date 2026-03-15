"use client";

import { useState } from "react";

const sections = [
  { id: "hero", label: "Hero / Bannière", fields: [
    { key: "title", label: "Titre principal", type: "text", value: "ENTRELEC" },
    { key: "subtitle", label: "Sous-titre", type: "textarea", value: "Votre partenaire en solutions électriques industrielles depuis 1997" },
    { key: "cta1", label: "Bouton principal", type: "text", value: "Nos Services" },
    { key: "cta2", label: "Bouton secondaire", type: "text", value: "Demander une Fiche Technique" },
  ]},
  { id: "about", label: "À Propos", fields: [
    { key: "title", label: "Titre", type: "text", value: "ENTRELEC" },
    { key: "desc", label: "Description", type: "textarea", value: "ENTRELEC est une S.A.R.L de droit algérien créée en 1997, spécialisée principalement dans le secteur de l'industrie électrique." },
    { key: "desc2", label: "Description 2", type: "textarea", value: "ENTRELEC vous offre une gamme complète de services dans les domaines suivants :" },
  ]},
  { id: "stats", label: "Statistiques", fields: [
    { key: "years", label: "Années d'expérience", type: "text", value: "27+" },
    { key: "projects", label: "Projets réalisés", type: "text", value: "500+" },
    { key: "clients", label: "Clients satisfaits", type: "text", value: "200+" },
    { key: "coverage", label: "Couverture", type: "text", value: "100%" },
  ]},
  { id: "contact", label: "Contact", fields: [
    { key: "address", label: "Adresse", type: "text", value: "Deli Ibrahim, Dely Brahim – Alger, Algérie" },
    { key: "phone", label: "Téléphone", type: "text", value: "+213 (0) 23.11.67.60/68" },
    { key: "email", label: "Email", type: "text", value: "contact@entrelec.dz" },
    { key: "technical", label: "Service technique", type: "text", value: "+213 (0) 550.58.74.63" },
  ]},
];

export default function ContentAdminPage() {
  const [data, setData] = useState(sections);
  const [activeSection, setActiveSection] = useState("hero");
  const [saved, setSaved] = useState(false);

  const updateField = (sectionId: string, fieldKey: string, value: string) => {
    setData(data.map(s => s.id === sectionId ? {
      ...s, fields: s.fields.map(f => f.key === fieldKey ? { ...f, value } : f)
    } : s));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const current = data.find(s => s.id === activeSection)!;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">Contenu</h1>
          <p className="text-txtmuted text-[.84rem] mt-1">Modifiez le contenu de votre page d&apos;accueil</p>
        </div>
        <button onClick={handleSave} className={`btn text-[.8rem] ${saved ? "bg-green-500/10 text-green-400 border-green-500/20" : "btn-primary"}`}>
          {saved ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Sauvegardé !
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
            {data.map(s => (
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
              {current.label}
            </h3>
            <div className="space-y-5">
              {current.fields.map(f => (
                <div key={f.key}>
                  <label className="block text-txtsec text-[.7rem] font-semibold uppercase tracking-wider mb-2">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea className="input resize-none" rows={3} value={f.value}
                      onChange={e => updateField(activeSection, f.key, e.target.value)} />
                  ) : (
                    <input className="input" value={f.value}
                      onChange={e => updateField(activeSection, f.key, e.target.value)} />
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
