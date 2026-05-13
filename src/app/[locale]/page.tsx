"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/lib/supabase";
import { useMultiSiteContent } from "@/lib/useContent";
import { useLocale } from "next-intl";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <About />
      <Clients />
      <CTA />
    </>
  );
}

/* ══════════════════ HERO ══════════════════ */
function Hero() {
  const locale = useLocale();
  const { content: c } = useMultiSiteContent(["hero"]);
  const h = c.hero || {};
  const [current, setCurrent] = useState(0);

  const slides = [
    { title: h.slide1_title || "", desc: h.slide1_desc || "", img: "/images/hero1.jpg", imgMobile: "/images/hero-industrial.png" },
    { title: h.slide2_title || "", desc: h.slide2_desc || "", img: "/images/hero2.jpg", imgMobile: "/images/hero-airport.png" },
    { title: h.slide3_title || "", desc: h.slide3_desc || "", img: "/images/hero3.jpg", imgMobile: "/images/hero-generators.png" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden bg-black">
      {slides.map((s, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-[1500ms] ${i === current ? "opacity-100" : "opacity-0"}`}>
          <Image src={s.imgMobile} alt={s.title} fill className="object-cover lg:hidden" sizes="100vw" priority={i === 0} />
          <Image src={s.img} alt={s.title} fill className="object-cover hidden lg:block" sizes="100vw" priority={i === 0} />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
      <div className="relative z-10 h-full container flex flex-col justify-end pb-20 lg:pb-28">
        <motion.div key={current} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8, ease: [.25,.1,.25,1] }}>
          <div className="section-label text-white/50 mb-6">{h.badge || "Depuis 2013"}</div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] max-w-4xl mb-6">
            {slides[current].title}
          </h1>
          <p className="text-white/50 text-base lg:text-lg max-w-xl mb-10 leading-relaxed">
            {slides[current].desc}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href={`/${locale}/services`} className="btn btn-primary">
              {h.cta_primary || "Nos Services"}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link href={`/${locale}/contact`} className="btn btn-ghost">{h.cta_secondary || "Contactez-nous"}</Link>
          </div>
        </motion.div>
        <div className="absolute bottom-8 end-8 lg:end-12 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`h-1 rounded-full transition-all duration-500 ${i === current ? "w-10 bg-orange" : "w-4 bg-white/20 hover:bg-white/40"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════ COUNT UP ══════════════════ */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  return <div ref={ref} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-orange tabular-nums mb-1 min-w-[70px] sm:min-w-[80px]">{count}{suffix}</div>;
}

/* ══════════════════ STATS ══════════════════ */
function Stats() {
  const [stats, setStats] = useState<{ target: number; suffix: string; label: string }[]>([]);

  useEffect(() => {
    supabase.from("site_content").select("key, value, label").eq("section", "stats").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        setStats(data.map(d => {
          const numMatch = d.value.match(/^(\d+)/);
          const target = numMatch ? parseInt(numMatch[1]) : 0;
          const suffix = d.value.replace(/^\d+/, "");
          return { target, suffix, label: d.label };
        }));
      }
    });
  }, []);

  if (stats.length === 0) return null;

  return (
    <section className="py-14 lg:py-20 bg-bg relative overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`text-center ${i < stats.length - 1 ? "lg:border-e lg:border-line/40" : ""}`}>
              <CountUp target={s.target} suffix={s.suffix} />
              <div className="text-txtsec text-[.65rem] sm:text-[.7rem] font-medium uppercase tracking-[.15em] mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════ SERVICES ══════════════════ */
function Services() {
  const locale = useLocale();
  const [items, setItems] = useState<{ id: string; title: string; description: string; image_url: string }[]>([]);

  useEffect(() => {
    supabase.from("services").select("id, title, description, image_url").eq("active", true).order("sort_order").then(({ data }) => {
      setItems(data ?? []);
    });
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="bg-bgalt relative overflow-hidden">
      <div className="section bg-bg">
        <div className="container">
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-txt tracking-tight leading-[1.1]">
                Nos Services
              </h2>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {items.map((s, i) => {
        const num = String(i + 1).padStart(2, "0");
        return (
        <div key={s.id} className="border-t border-line">
          <div className="container">
            <AnimatedSection>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch min-h-[500px]`}>
                <div className={`relative overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="relative h-[300px] lg:h-full w-full">
                    <Image src={s.image_url || "/images/service-electrical.png"} alt={s.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-4 left-4 z-20 text-[8rem] lg:text-[10rem] font-black text-orange/40 leading-none select-none pointer-events-none">{num}</div>
                  </div>
                </div>
                <div className={`flex flex-col justify-center p-8 lg:p-16 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="section-label mb-5">Service {num}</div>
                  <h3 className="text-2xl lg:text-3xl font-extrabold text-txt tracking-tight mb-5 leading-tight">{s.title}</h3>
                  <p className="text-txtsec text-[.92rem] leading-[1.85] mb-8 max-w-md">{s.description}</p>
                  <Link href={`/${locale}/services`}
                    className="inline-flex items-center gap-3 text-orange text-[.8rem] font-semibold uppercase tracking-wider group">
                    En savoir plus
                    <span className="w-8 h-px bg-orange group-hover:w-12 transition-all" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
        );
      })}
    </section>
  );
}

/* ══════════════════ ABOUT ══════════════════ */
function About() {
  const locale = useLocale();
  const { content: a } = useMultiSiteContent(["about", "stats"]);
  const about = a.about || {};
  const stats = a.stats || {};

  return (
    <section className="section-lg bg-bg relative overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <AnimatedSection>
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-sm overflow-hidden">
                <Image src="/images/about-team.png" alt="NASMO team" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div className="absolute -bottom-6 -right-6 lg:-right-10 bg-orange text-black p-6 lg:p-8">
                <div className="text-3xl lg:text-4xl font-black leading-none mb-1">{stats.years || "10+"}</div>
                <div className="text-[.7rem] font-bold uppercase tracking-wider opacity-70">{about.years_label || "Années d'expérience"}</div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="section-label mb-6">{about.section_tag || "À propos"}</div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-txt tracking-tight leading-[1.1] mb-6">
              {about.title || "NASMO"}
            </h2>
            <p className="text-txtsec text-[.92rem] leading-[1.9] mb-5">{about.desc1 || ""}</p>
            <p className="text-txtsec text-[.92rem] leading-[1.9] mb-8">{about.desc2 || ""}</p>

            <div className="space-y-4 mb-10">
              {[about.point1, about.point2, about.point3].filter(Boolean).map((s, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full border-2 border-orange flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-orange" />
                  </div>
                  <span className="text-txt text-[.88rem] font-medium">{s}</span>
                </div>
              ))}
            </div>

            <Link href={`/${locale}/a-propos`} className="btn btn-outline-orange">
              En savoir plus
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════ CLIENTS ══════════════════ */
function Clients() {
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    supabase.from("clients").select("name").eq("active", true).order("sort_order").then(({ data }) => {
      setNames(data?.map(d => d.name) ?? []);
    });
  }, []);

  if (names.length === 0) return null;

  return (
    <section className="section bg-bgalt border-t border-line">
      <div className="container">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="section-label justify-center mb-6">Nos Clients</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-txt tracking-tight">
              Ils nous font confiance
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-line">
          {names.map((name, i) => (
            <AnimatedSection key={i}>
              <div className="bg-bgalt flex items-center justify-center h-28 hover:bg-surface transition-colors group cursor-default">
                <span className="text-txtmuted text-lg font-bold tracking-wider group-hover:text-orange transition-colors">
                  {name}
                </span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════ CTA ══════════════════ */
function CTA() {
  const locale = useLocale();
  const { content: c } = useMultiSiteContent(["cta", "contact"]);
  const cta = c.cta || {};
  const contact = c.contact || {};

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[400px] lg:h-[500px]">
        <Image src="/images/hero-generators.png" alt="NASMO" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 h-full container flex flex-col items-center justify-center text-center">
          <AnimatedSection>
            <div className="section-label text-white/50 justify-center mb-6">Contactez-nous</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-5 max-w-2xl leading-tight">
              {cta.heading || "Un projet ? Contactez notre équipe."}
            </h2>
            <p className="text-white/40 mb-10 text-lg">
              {cta.phone_label || "Appelez-nous au"}{" "}
              <span className="text-orange font-bold">{contact.phone || cta.phone || "+213 551 99 55 68"}</span>
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href={`/${locale}/contact`} className="btn btn-primary">
                Contactez-nous
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <a href={`tel:${(contact.phone || "+213551995568").replace(/[\s().]/g, "")}`} className="btn btn-ghost">
                Appeler
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
