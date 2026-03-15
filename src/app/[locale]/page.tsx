"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import AnimatedSection from "@/components/AnimatedSection";

/* ══════════════════ COUNTER HOOK ══════════════════ */
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return { count, ref };
}

function CounterStat({ val, suffix, label, icon, delay }: { val: number; suffix: string; label: string; icon: string; delay: number }) {
  const { count, ref } = useCounter(val);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay, duration: .5 }}
      className="group relative bg-surface border border-line rounded-2xl p-6 sm:p-7 text-center hover:border-orange/20 hover:-translate-y-1 transition-all duration-400 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-orange to-orange-light scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      <div className="w-10 h-10 rounded-xl bg-orange/[0.07] flex items-center justify-center mx-auto mb-3 group-hover:bg-orange/[0.14] transition-colors">
        <svg className="w-5 h-5 text-orange" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <div className="text-2xl sm:text-3xl font-extrabold text-gradient mb-1">{count}{suffix}</div>
      <div className="text-txtmuted text-[.78rem] font-medium">{label}</div>
    </motion.div>
  );
}

/* ══════════════════ HERO ══════════════════ */
function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const [idx, setIdx] = useState(0);

  const slides = [
    { title: t("slide1Title"), desc: t("slide1Desc"), img: "/images/hero-industrial.png" },
    { title: t("slide2Title"), desc: t("slide2Desc"), img: "/images/hero-airport.png" },
    { title: t("slide3Title"), desc: t("slide3Desc"), img: "/images/hero-generators.png" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setIdx(p => (p + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-[100vh] min-h-[650px] max-h-[950px] overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute inset-0">
          <Image src={slides[idx].img} alt="" fill className="object-cover" priority sizes="100vw" />
          <div className="hero-overlay absolute inset-0" />
        </motion.div>
      </AnimatePresence>

      {/* Subtle grid */}
      <div className="absolute inset-0 dot-grid opacity-[0.03] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full container flex items-center pb-20">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .4, duration: .5 }} className="mb-6">
            <span className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[.7rem] font-bold tracking-[.15em] uppercase text-white/50 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
              ENTRELEC — Depuis 1997
            </span>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: .55, ease: "easeOut" }}>
              <h1 className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4.25rem] font-extrabold text-white leading-[1.05] tracking-tight mb-5">
                {slides[idx].title}
              </h1>
              <p className="text-white/45 text-base sm:text-lg max-w-lg leading-relaxed mb-8">
                {slides[idx].desc}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7 }}
            className="flex flex-wrap gap-3">
            <Link href={`/${locale}/services`} className="btn btn-primary text-[.84rem]">
              {t("cta")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </Link>
            <Link href={`/${locale}/contact`} className="btn btn-ghost text-[.84rem]">{t("ctaContact")}</Link>
          </motion.div>
        </div>
      </div>

      {/* Slide indicators — vertical */}
      <div className="absolute right-8 top-[calc(50%-2.5rem)] -translate-y-1/2 z-20 hidden lg:flex flex-col gap-3">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className="group flex items-center gap-3">
            <span className={`block rounded-full transition-all duration-500 ${
              i === idx ? "w-2.5 h-10 bg-orange shadow-[0_0_12px_rgba(245,158,11,.4)]" : "w-2 h-2 bg-white/15 group-hover:bg-white/30"
            }`} />
          </button>
        ))}
      </div>

      {/* Mobile dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex lg:hidden gap-2 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`rounded-full transition-all duration-500 ${
              i === idx ? "w-8 h-1.5 bg-orange" : "w-3 h-1.5 bg-white/15"
            }`} />
        ))}
      </div>

      {/* Scroll hint */}
      <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
          <div className="w-1 h-1.5 rounded-full bg-orange" />
        </motion.div>
      </motion.div>

      {/* Bottom fade — softer */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-bg via-bg/50 to-transparent z-10 pointer-events-none" />
    </section>
  );
}

/* ══════════════════ FEATURES ══════════════════ */
function Stats() {
  const t = useTranslations("about");
  const features = [
    { title: t("stats.years"), desc: "Depuis 1997", icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" },
    { title: t("stats.projects"), desc: "BT/MT & Industrie", icon: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" },
    { title: t("stats.clients"), desc: "Accompagnement sur mesure", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
    { title: t("stats.coverage"), desc: "À travers l'Algérie", icon: "M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" },
  ];

  return (
    <section className="relative z-10 -mt-16 pb-10">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * .1, duration: .5 }}
              className="group relative bg-surface border border-line rounded-2xl p-6 sm:p-7 text-center hover:border-orange/20 hover:-translate-y-1 transition-all duration-400 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-orange to-orange-light scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="w-10 h-10 rounded-xl bg-orange/[0.07] flex items-center justify-center mx-auto mb-3 group-hover:bg-orange/[0.14] transition-colors">
                <svg className="w-5 h-5 text-orange" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </div>
              <div className="text-[.9rem] sm:text-[.95rem] font-bold text-txt mb-1 group-hover:text-orange transition-colors">{f.title}</div>
              <div className="text-txtmuted text-[.72rem] font-medium">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════ ABOUT ══════════════════ */
function About() {
  const t = useTranslations("about");
  const locale = useLocale();
  const checks = [t("service1"), t("service2"), t("service3")];

  return (
    <section className="section-lg bg-bg">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <AnimatedSection direction="left">
            <div>
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="w-8 h-[2px] bg-orange rounded-full" />
                <span className="text-[.7rem] font-bold tracking-[.15em] uppercase text-orange">{t("sectionTag")}</span>
              </div>
              <h2 className="text-2xl sm:text-[2rem] font-extrabold text-txt tracking-tight leading-tight mb-5">
                {t("title")}
              </h2>
              <p className="text-txtsec text-[.92rem] leading-[1.85] mb-3">{t("description")}</p>
              <p className="text-txtsec text-[.92rem] leading-[1.85] mb-7">{t("description2")}</p>

              <ul className="space-y-3 mb-8">
                {checks.map((c, i) => (
                  <li key={i} className="flex items-center gap-3 text-[.875rem] text-txtsec group">
                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange/10 flex-shrink-0 group-hover:bg-orange/20 transition-colors">
                      <svg className="w-3.5 h-3.5 text-orange" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                      </svg>
                    </span>
                    <span className="group-hover:text-txt transition-colors">{c}</span>
                  </li>
                ))}
              </ul>

              <Link href={`/${locale}/a-propos`} className="btn btn-secondary">
                {t("sectionTag")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={.15}>
            <div className="relative group">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl ring-1 ring-black/5">
                <Image src="/images/about-team.png" alt="ENTRELEC Team" fill sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              {/* Experience badge */}
              <div className="absolute -bottom-5 -right-3 bg-surface border border-line rounded-xl px-5 py-3 shadow-xl hidden sm:flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center shadow-lg shadow-orange/20">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[.8rem] font-bold text-txt">27+ ans</div>
                  <div className="text-[.68rem] text-txtmuted">{t("stats.years")}</div>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 w-20 h-20 border-2 border-orange/10 rounded-2xl -z-10" />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════ SERVICES ══════════════════ */
function Services() {
  const t = useTranslations("services");
  const locale = useLocale();

  const items = [
    { title: t("electrical.title"), desc: t("electrical.desc"), img: "/images/service-electrical.png",
      icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
      feats: [t("electrical.features.f1"), t("electrical.features.f2"), t("electrical.features.f3"), t("electrical.features.f4")] },
    { title: t("airport.title"), desc: t("airport.desc"), img: "/images/service-airport.png",
      icon: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5",
      feats: [t("airport.features.f1"), t("airport.features.f2"), t("airport.features.f3"), t("airport.features.f4")] },
    { title: t("equipment.title"), desc: t("equipment.desc"), img: "/images/service-equipment.png",
      icon: "M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25",
      feats: [t("equipment.features.f1"), t("equipment.features.f2"), t("equipment.features.f3"), t("equipment.features.f4")] },
  ];

  return (
    <section className="section-lg bg-bgalt relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-[0.35] pointer-events-none" />
      {/* Decorative blobs */}
      <div className="absolute top-20 -left-32 w-64 h-64 bg-orange/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-32 w-64 h-64 bg-navy/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        <AnimatedSection>
          <div className="text-center mb-14 max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-6 h-px bg-orange/40" />
              <span className="text-[.7rem] font-bold tracking-[.15em] uppercase text-orange">{t("sectionTag")}</span>
              <span className="w-6 h-px bg-orange/40" />
            </div>
            <h2 className="text-2xl sm:text-[2rem] font-extrabold text-txt tracking-tight mb-3">{t("title")}</h2>
            <p className="text-txtsec text-[.92rem]">{t("subtitle")}</p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {items.map((s, i) => (
            <AnimatedSection key={i} delay={i * .1}>
              <div className="card overflow-hidden h-full flex flex-col group">
                <div className="relative h-56 overflow-hidden">
                  <Image src={s.img} alt={s.title} fill sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/60 via-navy-dark/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 w-11 h-11 rounded-xl bg-orange flex items-center justify-center shadow-lg shadow-orange/25">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.icon}/>
                    </svg>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white font-bold text-[.7rem]">0{i+1}</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-txt text-[1.1rem] mb-2 group-hover:text-orange transition-colors">{s.title}</h3>
                  <p className="text-txtsec text-[.84rem] leading-relaxed mb-5 flex-1">{s.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.feats.map((f, j) => (
                      <span key={j} className="text-[.7rem] px-3 py-1.5 rounded-lg bg-raised text-txtsec font-medium border border-line/50 hover:border-orange/20 hover:text-orange transition-all cursor-default">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA Banner */}
        <AnimatedSection delay={.3}>
          <div className="mt-14 rounded-2xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #061d3a, #0a2e5c 60%, #0f3d73)" }}>
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
  );
}

/* ══════════════════ PRODUCTS ══════════════════ */
function Products() {
  const t = useTranslations("products");
  const locale = useLocale();
  const items = [
    { name: "CYCLONE CL 100D", cat: "ups", img: "/images/product-cyclone.png" },
    { name: "Delta 200 Series UPS", cat: "ups", img: "/images/product-delta.png" },
    { name: "DLT SRV 33Hi", cat: "stabilizers", img: "/images/product-stabilizer.png" },
    { name: "EMB-2800", cat: "generators", img: "/images/product-emb2800.png" },
    { name: "EMB1400 INSO", cat: "generators", img: "/images/product-emb1400.png" },
    { name: "EMT 3125", cat: "generators", img: "/images/product-emt3125.png" },
  ];
  const catLabels: Record<string, string> = {
    ups: t("categories.ups"), generators: t("categories.generators"), stabilizers: t("categories.stabilizers"),
  };

  return (
    <section className="section-lg bg-bg relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        <AnimatedSection>
          <div className="text-center mb-14 max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-6 h-px bg-orange/40" />
              <span className="text-[.7rem] font-bold tracking-[.15em] uppercase text-orange">{t("sectionTag")}</span>
              <span className="w-6 h-px bg-orange/40" />
            </div>
            <h2 className="text-2xl sm:text-[2rem] font-extrabold text-txt tracking-tight mb-3">{t("title")}</h2>
            <p className="text-txtsec text-[.92rem]">{t("subtitle")}</p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p, i) => (
            <AnimatedSection key={i} delay={i * .06}>
              <div className="card group cursor-pointer overflow-hidden hover:shadow-xl">
                <div className="relative h-52 flex items-center justify-center bg-bgalt p-4">
                  <Image src={p.img} alt={p.name} width={180} height={180}
                    className="object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-lg group-hover:drop-shadow-2xl" />
                  <span className="absolute top-3 right-3 text-[.62rem] font-semibold px-3 py-1 rounded-full bg-surface border border-line text-txtmuted">
                    {catLabels[p.cat]}
                  </span>
                </div>
                <div className="p-5 text-center border-t border-line">
                  <h3 className="text-[.95rem] font-bold text-txt group-hover:text-orange transition-colors mb-2.5">{p.name}</h3>
                  <span className="text-orange text-[.8rem] font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    {t("viewDetails")}
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                    </svg>
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={.3}>
          <div className="text-center mt-12">
            <Link href={`/${locale}/produits`} className="btn btn-secondary">
              {t("downloadCatalog")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ══════════════════ CLIENTS ══════════════════ */
function Clients() {
  const t = useTranslations("clients");
  const names = ["Sonatrach", "Coca-Cola", "Cevital", "CAAR", "Sonelgaz", "Agip", "Elecnor", "HydraPharm", "Naftal", "Air Algérie"];

  return (
    <section className="section bg-bgalt relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-[0.35] pointer-events-none" />
      <div className="container relative z-10">
        <AnimatedSection>
          <div className="text-center mb-10">
            <span className="text-[.7rem] font-bold tracking-[.15em] uppercase text-orange">{t("sectionTag")}</span>
            <h2 className="text-2xl font-extrabold text-txt tracking-tight mt-3 mb-2">{t("title")}</h2>
            <p className="text-txtsec text-sm max-w-md mx-auto">{t("subtitle")}</p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={.1}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {names.map((n, i) => (
              <motion.div key={n} whileHover={{ y: -4, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center justify-center px-4 py-5 rounded-xl bg-surface border border-line text-txtmuted text-[.82rem] font-semibold tracking-wide hover:border-orange/30 hover:text-orange hover:shadow-lg hover:shadow-orange/5 cursor-default transition-colors duration-300">
                {n}
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ══════════════════ CONTACT ══════════════════ */
function Contact() {
  const t = useTranslations("contact");
  const locale = useLocale();

  const infoItems = [
    { icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z", label: t("info.address"), val: t("info.addressValue") },
    { icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z", label: t("info.phone"), val: `${t("info.phoneValue")}\n${t("info.mobile")}` },
    { icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75", label: t("info.email"), val: t("info.emailValue") },
  ];

  return (
    <section className="section-lg bg-bg relative">
      {/* Top transition */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">
          <AnimatedSection direction="left" className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-8 h-[2px] bg-orange rounded-full" />
              <span className="text-[.7rem] font-bold tracking-[.15em] uppercase text-orange">{t("sectionTag")}</span>
            </div>
            <h2 className="text-2xl sm:text-[2rem] font-extrabold text-txt tracking-tight leading-snug mb-3">{t("title")}</h2>
            <p className="text-txtsec text-[.92rem] mb-8 max-w-sm">{t("subtitle")}</p>

            <div className="space-y-5">
              {infoItems.map((c, i) => (
                <div key={i} className="flex items-start gap-3.5 group">
                  <div className="w-11 h-11 rounded-xl bg-orange/[0.07] border border-orange/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-orange/[0.15] group-hover:border-orange/20 transition-all">
                    <svg className="w-4.5 h-4.5 text-orange" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={c.icon}/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[.68rem] text-txtmuted font-semibold uppercase tracking-widest mb-0.5">{c.label}</div>
                    <div className="text-txt text-[.875rem] whitespace-pre-line leading-relaxed">{c.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={.15} className="lg:col-span-3">
            <form className="card p-6 sm:p-8 space-y-4 hover:shadow-xl transition-shadow duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-txtsec text-[.7rem] font-semibold uppercase tracking-wider mb-1.5">{t("form.name")}</label>
                  <input type="text" placeholder={t("form.name")} className="input" />
                </div>
                <div>
                  <label className="block text-txtsec text-[.7rem] font-semibold uppercase tracking-wider mb-1.5">{t("form.email")}</label>
                  <input type="email" placeholder={t("form.email")} className="input" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-txtsec text-[.7rem] font-semibold uppercase tracking-wider mb-1.5">{t("form.phone")}</label>
                  <input type="tel" placeholder={t("form.phone")} className="input" />
                </div>
                <div>
                  <label className="block text-txtsec text-[.7rem] font-semibold uppercase tracking-wider mb-1.5">{t("form.subject")}</label>
                  <input type="text" placeholder={t("form.subject")} className="input" />
                </div>
              </div>
              <div>
                <label className="block text-txtsec text-[.7rem] font-semibold uppercase tracking-wider mb-1.5">{t("form.message")}</label>
                <textarea placeholder={t("form.message")} rows={5} className="input resize-none" />
              </div>
              <button type="submit" className="btn btn-primary w-full text-[.84rem]">
                {t("form.send")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                </svg>
              </button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════ PAGE ══════════════════ */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <Services />
      <Products />
      <Clients />
      <Contact />
    </>
  );
}
