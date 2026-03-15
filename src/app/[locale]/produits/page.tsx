"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";

export const products = [
  // Stabilisateurs de Tension
  { slug: "dlt-srv-33hi", name: "DLT SRV 33Hi", cat: "stabilisateurs", sub: "Triphasé", desc: "Stabilisateur triphasé industriel haute performance", power: "10-2000 KVA", img: "/images/product-stabilizer.png", brand: "DELTA" },
  { slug: "dlt-srv-11", name: "DLT SRV 11", cat: "stabilisateurs", sub: "Monophasé", desc: "Stabilisateur monophasé pour équipements sensibles", power: "1-30 KVA", img: "/images/product-stabilizer.png", brand: "DELTA" },
  { slug: "dlt-srv-33", name: "DLT SRV 33", cat: "stabilisateurs", sub: "Triphasé", desc: "Stabilisateur triphasé standard", power: "6-500 KVA", img: "/images/product-stabilizer.png", brand: "DELTA" },

  // Groupes Électrogènes
  { slug: "emb-2800", name: "EMB-2800", cat: "groupes", sub: "Ouvert", desc: "Groupe électrogène diesel 2800 KVA", power: "2800 KVA", img: "/images/product-emb2800.png", brand: "Electra Molins" },
  { slug: "emb-1400-inso", name: "EMB1400 INSO", cat: "groupes", sub: "Insonorisé", desc: "Groupe électrogène insonorisé 1400 KVA", power: "1400 KVA", img: "/images/product-emb1400.png", brand: "Electra Molins" },
  { slug: "emt-3125", name: "EMT 3125", cat: "groupes", sub: "Ouvert", desc: "Groupe électrogène industriel 3125 KVA", power: "3125 KVA", img: "/images/product-emt3125.png", brand: "Electra Molins" },
  { slug: "emb-500-inso", name: "EMB 500 INSO", cat: "groupes", sub: "Insonorisé", desc: "Groupe électrogène insonorisé compact 500 KVA", power: "500 KVA", img: "/images/product-emb1400.png", brand: "Electra Molins" },
  { slug: "emb-150", name: "EMB 150", cat: "groupes", sub: "Ouvert", desc: "Groupe électrogène 150 KVA pour PME", power: "150 KVA", img: "/images/product-emb2800.png", brand: "Electra Molins" },

  // Onduleurs
  { slug: "cyclone-cl-100d", name: "CYCLONE CL 100D", cat: "onduleurs", sub: "Online", desc: "Onduleur online double conversion haute performance", power: "1-10 KVA", img: "/images/product-cyclone.png", brand: "DELTA" },
  { slug: "delta-200-series", name: "Delta 200 Series", cat: "onduleurs", sub: "Modulaire", desc: "Système UPS modulaire évolutif pour datacenters", power: "20-200 KVA", img: "/images/product-delta.png", brand: "DELTA" },
  { slug: "delta-hph-series", name: "Delta HPH Series", cat: "onduleurs", sub: "Online", desc: "UPS online triphasé haute puissance", power: "20-120 KVA", img: "/images/product-delta.png", brand: "DELTA" },
  { slug: "delta-rt-series", name: "Delta RT Series", cat: "onduleurs", sub: "Rack/Tower", desc: "UPS rack/tower compact pour serveurs", power: "1-10 KVA", img: "/images/product-cyclone.png", brand: "DELTA" },

  // Augier Energy
  { slug: "transfo-augier-100", name: "Transformateur 100 MVA", cat: "augier", sub: "Transformateurs", desc: "Transformateur de puissance haute tension", power: "100 MVA", img: "/images/service-equipment.png", brand: "Augier Energy" },
  { slug: "cellule-mt-augier", name: "Cellule MT Augier", cat: "augier", sub: "Cellules MT", desc: "Cellule de coupure et protection moyenne tension", power: "36 KV", img: "/images/service-equipment.png", brand: "Augier Energy" },
  { slug: "relais-protection", name: "Relais de Protection", cat: "augier", sub: "Protection", desc: "Relais de protection numérique multifonction", power: "—", img: "/images/service-equipment.png", brand: "Augier Energy" },

  // Équipements d'Aéroport
  { slug: "feux-piste-led", name: "Feux de Piste LED", cat: "aeroport", sub: "Balisage", desc: "Feux d'approche et de piste à LED haute intensité", power: "—", img: "/images/service-airport.png", brand: "OCEM" },
  { slug: "regulateur-ccr", name: "Régulateur CCR", cat: "aeroport", sub: "Régulateurs", desc: "Régulateur de courant constant pour circuits de balisage", power: "4-30 KW", img: "/images/service-airport.png", brand: "OCEM" },
  { slug: "systeme-papi", name: "Système PAPI", cat: "aeroport", sub: "Navigation", desc: "Indicateur visuel de pente d'approche certifié OACI", power: "—", img: "/images/service-airport.png", brand: "OCEM" },
];

const categories = [
  { key: "all", label: "Tous les produits", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" },
  { key: "stabilisateurs", label: "Stabilisateurs de Tension", icon: "M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" },
  { key: "groupes", label: "Groupes Électrogènes", icon: "M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" },
  { key: "onduleurs", label: "Onduleurs", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
  { key: "augier", label: "Augier Energy", icon: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" },
  { key: "aeroport", label: "Équipements d'Aéroport", icon: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" },
];

const catLabels: Record<string, string> = {
  stabilisateurs: "Stabilisateurs", groupes: "Groupes Électrogènes", onduleurs: "Onduleurs", augier: "Augier Energy", aeroport: "Aéroport",
};

export default function ProductsPage() {
  const t = useTranslations("products");
  const locale = useLocale();
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [subFilter, setSubFilter] = useState("all");

  // Get subcategories for active category
  const subcats = active !== "all"
    ? [...new Set(products.filter(p => p.cat === active).map(p => p.sub))]
    : [];

  const filtered = products.filter(p => {
    const matchCat = active === "all" || p.cat === active;
    const matchSub = subFilter === "all" || p.sub === subFilter;
    const matchSearch = search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSub && matchSearch;
  });

  return (
    <>
      {/* Hero */}
      <section className="page-hero pt-20 pb-12 lg:pt-24 lg:pb-16">
        <div className="container text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-orange/40" />
              <span className="text-[.65rem] font-bold tracking-[.2em] uppercase text-white/40">{t("sectionTag")}</span>
              <span className="w-8 h-px bg-orange/40" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[3.5rem] font-extrabold text-white tracking-tight mb-5 leading-tight">
              {t("title")}
            </h1>
            <p className="text-white/40 max-w-lg mx-auto text-[.95rem] leading-relaxed">{t("subtitle")}</p>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section className="section-lg bg-bg relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-[0.025] pointer-events-none" />
        <div className="container relative z-10">

          {/* Search bar */}
          <AnimatedSection>
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-txtmuted pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input type="text" placeholder="Rechercher un produit, une marque..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="input w-full" style={{ paddingLeft: '2.75rem' }} />
              </div>
            </div>
          </AnimatedSection>

          {/* Category tabs */}
          <AnimatedSection>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {categories.map(c => (
                <button key={c.key} onClick={() => { setActive(c.key); setSubFilter("all"); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[.76rem] font-semibold tracking-wide transition-all duration-300 ${
                    active === c.key
                      ? "bg-navy text-white shadow-lg shadow-navy/20"
                      : "bg-surface text-txtsec border border-line hover:border-navy/20 hover:text-txt"
                  }`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
                  </svg>
                  {c.label}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Subcategory filters */}
          <AnimatePresence>
            {subcats.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="flex justify-center gap-2 mb-10 overflow-hidden">
                <button onClick={() => setSubFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-[.72rem] font-medium transition-all ${
                    subFilter === "all" ? "bg-orange/10 text-orange border border-orange/15" : "text-txtmuted hover:text-txtsec border border-transparent"
                  }`}>
                  Tout
                </button>
                {subcats.map(s => (
                  <button key={s} onClick={() => setSubFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-[.72rem] font-medium transition-all ${
                      subFilter === s ? "bg-orange/10 text-orange border border-orange/15" : "text-txtmuted hover:text-txtsec border border-transparent"
                    }`}>
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-txtmuted text-[.78rem]">
              {filtered.length} produit{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map(p => (
                <motion.div key={p.slug} layout
                  initial={{ opacity: 0, scale: .95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: .95 }}
                  transition={{ duration: .25 }}>
                  <Link href={`/${locale}/produits/${p.slug}`}>
                    <div className="card group cursor-pointer overflow-hidden hover:shadow-xl h-full flex flex-col">
                      <div className="relative h-48 flex items-center justify-center bg-bgalt p-4">
                        <Image src={p.img} alt={p.name} width={160} height={160}
                          className="object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-lg" />
                        <span className="absolute top-3 left-3 text-[.6rem] font-semibold px-2.5 py-1 rounded-full bg-surface border border-line text-txtmuted">
                          {catLabels[p.cat]}
                        </span>
                        {p.sub && (
                          <span className="absolute top-3 right-3 text-[.58rem] font-medium px-2 py-0.5 rounded-full bg-orange/10 text-orange border border-orange/10">
                            {p.sub}
                          </span>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col border-t border-line">
                        <div className="text-[.65rem] text-orange/60 font-semibold uppercase tracking-wider mb-1">{p.brand}</div>
                        <h3 className="text-[.9rem] font-bold text-txt group-hover:text-orange transition-colors mb-1">{p.name}</h3>
                        <p className="text-txtmuted text-[.75rem] mb-3 flex-1">{p.desc}</p>
                        {p.power !== "—" && (
                          <div className="text-[.7rem] text-txtsec font-medium mb-2">
                            <span className="text-txtmuted">Puissance:</span> {p.power}
                          </div>
                        )}
                        <span className="text-orange text-[.76rem] font-medium inline-flex items-center gap-1.5 group-hover:gap-2 transition-all mt-auto">
                          Voir détails
                          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-bgalt flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-txtmuted" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <p className="text-txtsec text-[.9rem] font-medium">Aucun produit trouvé</p>
              <p className="text-txtmuted text-[.78rem] mt-1">Essayez de modifier vos filtres ou votre recherche</p>
            </div>
          )}

          {/* Download */}
          <AnimatedSection delay={.2}>
            <div className="text-center mt-14">
              <a href="https://entrelec.dz/wp-content/uploads/2020/09/entrelec-catalogue-22-pages.pdf"
                target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                </svg>
                {t("downloadCatalog")} (PDF)
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
