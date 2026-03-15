"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";

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
      className="group relative bg-surface border border-line rounded-2xl p-6 sm:p-7 text-center hover:border-orange/20 hover:-translate-y-1 transition-all duration-400 overflow-hidden h-full">
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

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale();

  const stats = [
    { val: 27, suffix: "+", label: t("stats.years"), icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" },
    { val: 500, suffix: "+", label: t("stats.projects"), icon: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" },
    { val: 200, suffix: "+", label: t("stats.clients"), icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
    { val: 100, suffix: "%", label: t("stats.coverage"), icon: "M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" },
  ];

  const values = [
    {
      title: t("qualityTitle"), desc: t("qualityDesc"),
      icon: "M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z",
      color: "from-orange/10 to-orange/5",
    },
    {
      title: t("devTitle"), desc: t("devDesc"),
      icon: "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
      color: "from-navy/10 to-navy/5",
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
            <p className="text-white/40 max-w-lg mx-auto text-[.95rem] leading-relaxed">{t("description")}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-lg bg-bg relative overflow-hidden">
        <div className="absolute top-20 -right-32 w-64 h-64 bg-orange/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <AnimatedSection direction="left">
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="w-8 h-[2px] bg-orange rounded-full" />
                <span className="text-[.7rem] font-bold tracking-[.15em] uppercase text-orange">{t("sectionTag")}</span>
              </div>
              <p className="text-txtsec text-[.92rem] leading-[1.85] mb-3">{t("description")}</p>
              <p className="text-txtsec text-[.92rem] leading-[1.85] mb-7">{t("description2")}</p>

              <ul className="space-y-3 mb-7">
                {[t("service1"), t("service2"), t("service3")].map((s, i) => (
                  <li key={i} className="flex items-center gap-3 text-[.875rem] text-txtsec group">
                    <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-orange/10 flex-shrink-0 group-hover:bg-orange/20 transition-colors">
                      <svg className="w-3.5 h-3.5 text-orange" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                      </svg>
                    </span>
                    <span className="group-hover:text-txt transition-colors">{s}</span>
                  </li>
                ))}
              </ul>

              <p className="text-txtsec text-[.92rem] leading-[1.85] mb-2">{t("expertise")}</p>
              <p className="text-txt text-[.92rem] font-semibold">{t("coverage")}</p>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={.15}>
              <div className="relative group">
                <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl ring-1 ring-black/5">
                  <Image src="/images/about-team.png" alt="ENTRELEC Team" fill sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="absolute -top-4 -left-4 w-20 h-20 border-2 border-orange/10 rounded-2xl -z-10" />
                <div className="absolute -bottom-4 -right-4 w-16 h-16 border-2 border-navy/10 rounded-2xl -z-10" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section bg-bgalt relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-[0.35] pointer-events-none" />
        <div className="container relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {stats.map((s, i) => (
              <CounterStat key={i} val={s.val} suffix={s.suffix} label={s.label} icon={s.icon} delay={i * .08} />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-lg bg-bg relative overflow-hidden">
        <div className="absolute bottom-20 -left-32 w-64 h-64 bg-navy/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="container max-w-3xl relative z-10">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="w-6 h-px bg-orange/40" />
                <span className="text-[.7rem] font-bold tracking-[.15em] uppercase text-orange">
                  {locale === "ar" ? "قيمنا" : locale === "en" ? "Our Values" : "Nos Valeurs"}
                </span>
                <span className="w-6 h-px bg-orange/40" />
              </div>
              <h2 className="text-2xl font-extrabold text-txt tracking-tight">
                {locale === "ar" ? "قيمنا" : locale === "en" ? "Our Values" : "Nos Valeurs"}
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {values.map((v, i) => (
              <AnimatedSection key={i} delay={i * .1}>
                <div className="card p-7 group hover:border-orange/15 h-full hover:shadow-lg transition-all duration-400">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <svg className="w-5 h-5 text-orange" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={v.icon}/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-txt text-[1.05rem] mb-2 group-hover:text-orange transition-colors">{v.title}</h3>
                  <p className="text-txtsec text-[.84rem] leading-relaxed">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-bgalt relative">
        <div className="absolute inset-0 dot-grid opacity-[0.35] pointer-events-none" />
        <div className="container text-center max-w-lg relative z-10">
          <AnimatedSection>
            <h2 className="text-xl font-extrabold text-txt mb-3">
              {locale === "ar" ? "هل لديك مشروع؟" : locale === "en" ? "Have a project?" : "Vous avez un projet ?"}
            </h2>
            <p className="text-txtsec text-sm mb-8">
              {locale === "ar" ? "اتصل بنا اليوم لمناقشة احتياجاتك" : locale === "en" ? "Contact us today" : "Contactez-nous dès maintenant"}
            </p>
            <Link href={`/${locale}/contact`} className="btn btn-primary">
              {locale === "ar" ? "اتصل بنا" : locale === "en" ? "Contact Us" : "Nous Contacter"}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
