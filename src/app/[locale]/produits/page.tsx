"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/lib/supabase";

interface Product {
  slug: string;
  name: string;
  category: string;
  sub_category: string;
  description: string;
  power: string;
  image_url: string;
  brand: string;
}

const categories = [
  { key: "all", label: "All Products" },
  { key: "variateurs", label: "Variateurs" },
  { key: "stabilisateurs", label: "Stabilisateurs" },
  { key: "groupes", label: "Groupes Électrogènes" },
  { key: "onduleurs", label: "Onduleurs" },
  { key: "augier", label: "Augier Energy" },
];

const catLabels: Record<string, string> = {
  stabilisateurs: "Stabilisateurs", groupes: "Groupes", onduleurs: "Onduleurs", augier: "Augier", variateurs: "Variateurs",
};

export default function ProductsPage() {
  const locale = useLocale();
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("products").select("*").eq("active", true).order("sort_order").then(({ data }) => {
      setProducts(data ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter(p => {
    const matchCat = active === "all" || p.category === active;
    const matchSearch = search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[300px] max-h-[400px] overflow-hidden bg-black">
        <Image src="/images/hero-industrial.png" alt="Products" fill className="object-cover opacity-30" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90" />
        <div className="relative z-10 h-full container flex flex-col justify-end pb-14">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
            <div className="section-label text-white/40 mb-5">Nos Produits</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
              Catalogue Produits
            </h1>
            <p className="text-white/35 mt-4 max-w-lg text-base">Découvrez notre gamme complète d'équipements électriques industriels</p>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section className="section-lg bg-bg">
        <div className="container">
          {/* Search + Filters */}
          <AnimatedSection>
            <div className="flex flex-col lg:flex-row gap-4 mb-10 items-start lg:items-center justify-between">
              <div className="relative w-full lg:w-80">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txtmuted pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input type="text" placeholder="Search products..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="input w-full" style={{ paddingLeft: '2.5rem' }} />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(c => (
                  <button key={c.key} onClick={() => setActive(c.key)}
                    className={`px-4 py-2 text-[.75rem] font-semibold uppercase tracking-wider transition-all duration-300 ${
                      active === c.key ? "bg-orange text-black" : "text-txtmuted hover:text-txt border border-line"
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Results count */}
          <div className="flex items-center gap-3 mb-8 border-b border-line pb-4">
            <span className="text-txtmuted text-[.78rem] uppercase tracking-wider">
              {loading ? "Loading..." : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
            </span>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <svg className="w-6 h-6 animate-spin text-orange" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-line">
              <AnimatePresence mode="popLayout">
                {filtered.map(p => (
                  <motion.div key={p.slug} layout
                    initial={{ opacity: 0, scale: .95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: .95 }}
                    transition={{ duration: .25 }}>
                    <Link href={`/${locale}/produits/${p.slug}`}>
                      <div className="bg-bg group cursor-pointer h-full flex flex-col hover:bg-bgalt transition-colors">
                        <div className="relative h-48 flex items-center justify-center bg-bgalt p-4 border-b border-line">
                          <Image src={p.image_url} alt={p.name} width={140} height={140}
                            className="object-contain transition-all duration-500 group-hover:scale-110" />
                          <span className="absolute top-3 left-3 text-[.6rem] font-bold uppercase tracking-[.15em] text-txtmuted">
                            {catLabels[p.category]}
                          </span>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="text-[.6rem] text-orange font-bold uppercase tracking-[.2em] mb-1.5">{p.brand}</div>
                          <h3 className="text-[.88rem] font-bold text-txt group-hover:text-orange transition-colors mb-1.5">{p.name}</h3>
                          <p className="text-txtmuted text-[.75rem] mb-3 flex-1 leading-relaxed">{p.description}</p>
                          {p.power !== "-" && (
                            <div className="text-[.7rem] text-txtsec font-medium mb-3">{p.power}</div>
                          )}
                          <span className="text-orange text-[.72rem] font-bold uppercase tracking-wider inline-flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
                            Voir détails
                            <span className="w-4 h-px bg-orange group-hover:w-7 transition-all" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-txtsec text-sm font-medium">No products found</p>
              <p className="text-txtmuted text-[.78rem] mt-1">Try adjusting your filters</p>
            </div>
          )}

          {/* Download */}
          <AnimatedSection>
            <div className="text-center mt-16 pt-10 border-t border-line">
              <a href="https://nasmo.dz/wp-content/uploads/2020/09/nasmo-catalogue-22-pages.pdf"
                target="_blank" rel="noopener noreferrer" className="btn btn-outline-orange">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                </svg>
                Télécharger le catalogue (PDF)
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
