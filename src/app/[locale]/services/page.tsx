"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

export default function ServicesPage() {
  const t = useTranslations("services");
  const locale = useLocale();

  const items = [
    {
      slug: "montage-installation", title: t("electrical.title"), desc: t("electrical.desc"), img: "/images/service-electrical.png",
      icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
      feats: [t("electrical.features.f1"), t("electrical.features.f2"), t("electrical.features.f3"), t("electrical.features.f4")],
    },
    {
      slug: "balisage-aeroports", title: t("airport.title"), desc: t("airport.desc"), img: "/images/service-airport.png",
      icon: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5",
      feats: [t("airport.features.f1"), t("airport.features.f2"), t("airport.features.f3"), t("airport.features.f4")],
    },
    {
      slug: "augier-energie", title: "Augier Énergie", desc: "Distribution et intégration de solutions énergétiques Augier — transformateurs, systèmes de protection et équipements de distribution électrique haute performance.", img: "/images/service-equipment.png",
      icon: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z",
      feats: ["Transformateurs", "Protection électrique", "Distribution HT/BT", "Maintenance préventive"],
    },
    {
      slug: "onduleurs-stabilisateurs", title: "Onduleurs & Stabilisateurs DELTA", desc: "Fourniture, installation et maintenance des onduleurs UPS et stabilisateurs de tension DELTA pour la protection continue de vos équipements critiques.", img: "/images/product-delta.png",
      icon: "M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25",
      feats: ["UPS Online", "Stabilisateurs triphasés", "Onduleurs modulaires", "Service après-vente"],
    },
    {
      slug: "groupes-electrogenes", title: "Groupes Électrogènes", desc: "Vente, installation et maintenance de groupes électrogènes Electra Molins — solutions de production d'énergie de secours pour l'industrie et le tertiaire.", img: "/images/product-emb2800.png",
      icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5",
      feats: ["Groupes diesel", "Groupes insonorisés", "Installation clé en main", "Contrats de maintenance"],
    },
    {
      slug: "secteur-agl", title: "Secteur AGL — OCEM", desc: "Solutions d'aide à l'atterrissage et balisage lumineux OCEM AirfieldTechnology — systèmes certifiés OACI/FAA pour aéroports civils et militaires.", img: "/images/service-airport.png",
      icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418",
      feats: ["Balisage lumineux", "Systèmes PAPI/VASI", "Conformité OACI", "Maintenance aéroportuaire"],
    },
  ];

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

      {/* Services — alternating layout */}
      <section className="section-lg bg-bg relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-[0.025] pointer-events-none" />
        {/* Decorative */}
        <div className="absolute top-40 -left-20 w-48 h-48 bg-orange/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-40 -right-20 w-48 h-48 bg-navy/[0.05] rounded-full blur-3xl pointer-events-none" />

        <div className="container space-y-24 lg:space-y-32 relative z-10">
          {items.map((s, i) => (
            <AnimatedSection key={i}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
                {/* Image */}
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] group shadow-2xl ring-1 ring-black/5">
                    <Image src={s.img} alt={s.title} fill sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/50 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 w-12 h-12 rounded-xl bg-orange flex items-center justify-center shadow-lg shadow-orange/25">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d={s.icon}/>
                      </svg>
                    </div>
                    <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                      <span className="text-white font-bold text-sm">0{i + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="inline-flex items-center gap-3 mb-5">
                    <span className="w-8 h-[2px] bg-orange rounded-full" />
                    <span className="text-[.65rem] font-bold tracking-[.15em] uppercase text-orange">0{i + 1}</span>
                  </div>
                  <h2 className="text-xl lg:text-[1.75rem] font-extrabold text-txt mb-4 tracking-tight leading-tight">
                    {s.title}
                  </h2>
                  <p className="text-txtsec text-[.92rem] leading-[1.85] mb-8">{s.desc}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {s.feats.map((f, j) => (
                      <div key={j}
                        className="flex items-center gap-3 p-3.5 rounded-xl bg-bgalt border border-line/50 hover:border-orange/20 transition-all duration-300 group cursor-default">
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-orange/[0.08] flex-shrink-0 group-hover:bg-orange/[0.16] transition-colors">
                          <svg className="w-3.5 h-3.5 text-orange" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                          </svg>
                        </span>
                        <span className="text-txt text-[.82rem] font-medium group-hover:text-orange transition-colors">{f}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={`/${locale}/services/${s.slug}`}
                    className="inline-flex items-center gap-2 mt-6 text-orange text-[.82rem] font-semibold hover:gap-3 transition-all group">
                    En savoir plus
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-bgalt relative">
        <div className="absolute inset-0 dot-grid opacity-[0.35] pointer-events-none" />
        <div className="container relative z-10">
          <AnimatedSection>
            <div className="rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #061d3a, #0a2e5c 60%, #0f3d73)" }}>
              <div className="absolute inset-0 dot-grid opacity-[0.06]" />
              <div className="absolute top-0 right-0 w-72 h-72 bg-orange/[0.04] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange/[0.03] rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{t("ctaTitle")}</h3>
                  <p className="text-white/35 text-sm">
                    {t("ctaPhone")} <span className="text-orange font-semibold">021 91 08 35 / 0551 99 55 68</span>
                  </p>
                </div>
                <Link href={`/${locale}/contact`} className="btn btn-primary whitespace-nowrap">{t("ctaButton")}</Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
