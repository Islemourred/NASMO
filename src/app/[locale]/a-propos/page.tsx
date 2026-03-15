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

function CounterStat({ val, suffix, label, delay }: { val: number; suffix: string; label: string; delay: number }) {
  const { count, ref } = useCounter(val);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay, duration: .5 }}
      className="text-center lg:text-left">
      <div className="stat-number mb-2">{count}{suffix}</div>
      <div className="text-txtsec text-sm font-medium uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}

export default function AboutPage() {
  const t = useTranslations("about");
  const locale = useLocale();

  const stats = [
    { val: 10, suffix: "+", label: t("stats.years") },
    { val: 500, suffix: "+", label: t("stats.projects") },
    { val: 50, suffix: "+", label: t("stats.clients") },
    { val: 48, suffix: "", label: t("stats.coverage") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] max-h-[450px] overflow-hidden bg-black">
        <Image src="/images/about-team.png" alt="NASMO Team" fill className="object-cover opacity-40" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90" />
        <div className="relative z-10 h-full container flex flex-col justify-end pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
            <div className="section-label text-white/40 mb-5">{t("sectionTag")}</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
              {t("title")}
            </h1>
            <p className="text-white/35 mt-4 max-w-lg text-base">{t("description")}</p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="section bg-bg border-b border-line">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
            {stats.map((s, i) => (
              <CounterStat key={i} val={s.val} suffix={s.suffix} label={s.label} delay={i * .08} />
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-lg bg-bg relative overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <AnimatedSection>
              <div className="relative">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src="/images/about-team.png" alt="NASMO Team" fill sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover" />
                </div>
                <div className="absolute -bottom-6 -right-6 lg:-right-10 bg-orange text-black p-6 lg:p-8">
                  <div className="text-3xl lg:text-4xl font-black leading-none mb-1">10+</div>
                  <div className="text-[.7rem] font-bold uppercase tracking-wider opacity-70">Years</div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="section-label mb-6">Fabrication & Service</div>
              <p className="text-txtsec text-[.92rem] leading-[1.9] mb-5">{t("description")}</p>
              <p className="text-txtsec text-[.92rem] leading-[1.9] mb-8">{t("description2")}</p>

              <div className="space-y-4 mb-10">
                {[t("service1"), t("service2"), t("service3")].map((s, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-5 h-5 rounded-full border-2 border-orange flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-orange" />
                    </div>
                    <span className="text-txt text-[.88rem] font-medium">{s}</span>
                  </div>
                ))}
              </div>

              <p className="text-txtsec text-[.88rem] leading-[1.85] mb-2">{t("expertise")}</p>
              <p className="text-txt text-[.88rem] font-semibold">{t("coverage")}</p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-bgalt border-t border-line">
        <div className="container max-w-3xl">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="section-label justify-center mb-5">
                {locale === "ar" ? "قيمنا" : locale === "en" ? "Our Values" : "Nos Valeurs"}
              </div>
              <h2 className="text-3xl font-extrabold text-txt tracking-tight">
                {t("qualityTitle")} & {t("devTitle")}
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: t("qualityTitle"), desc: t("qualityDesc") },
              { title: t("devTitle"), desc: t("devDesc") },
            ].map((v, i) => (
              <AnimatedSection key={i}>
                <div className="border-t-2 border-orange pt-6">
                  <h3 className="font-bold text-txt text-lg mb-3">{v.title}</h3>
                  <p className="text-txtsec text-[.88rem] leading-relaxed">{v.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative h-[350px] overflow-hidden">
        <Image src="/images/hero-industrial.png" alt="Contact" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 h-full container flex flex-col items-center justify-center text-center">
          <AnimatedSection>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-4 tracking-tight">
              {locale === "ar" ? "هل لديك مشروع؟" : locale === "en" ? "Have a project?" : "Vous avez un projet ?"}
            </h2>
            <p className="text-white/35 mb-8">
              {locale === "ar" ? "اتصل بنا اليوم" : locale === "en" ? "Contact us today" : "Contactez-nous"}
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
