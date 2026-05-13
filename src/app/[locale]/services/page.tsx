"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/lib/supabase";

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  image_url: string;
  sort_order: number;
}

export default function ServicesPage() {
  const t = useTranslations("services");
  const locale = useLocale();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("services").select("*").eq("active", true).order("sort_order").then(({ data }) => {
      setServices(data ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[550px] overflow-hidden bg-black">
        <Image src="/images/hero-airport.png" alt="Services" fill className="object-cover opacity-60 lg:hidden" sizes="100vw" />
        <Image src="/images/hero2.jpg" alt="Services" fill className="object-cover opacity-60 hidden lg:block" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
        <div className="relative z-10 h-full container flex flex-col justify-end pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
            <div className="section-label text-white/40 mb-5">{t("sectionTag")}</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
              {t("title")}
            </h1>
            <p className="text-white/35 mt-4 max-w-lg text-base">{t("subtitle")}</p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      {loading ? (
        <div className="flex justify-center py-20 bg-bg">
          <svg className="w-6 h-6 animate-spin text-orange" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      ) : (
        services.map((s, i) => (
          <section key={s.id} className={`border-t border-line ${i % 2 === 0 ? "bg-bg" : "bg-bgalt"}`}>
            <div className="container">
              <AnimatedSection>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch min-h-[550px]">
                  {/* Image */}
                  <div className={`relative overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="relative h-[350px] lg:h-full w-full">
                      <Image src={s.image_url || "/images/service-electrical.png"} alt={s.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute top-4 left-4 z-20 text-[8rem] lg:text-[10rem] font-black text-orange/40 leading-none select-none pointer-events-none">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex flex-col justify-center p-8 lg:p-16 xl:p-20 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                    <div className="section-label mb-5">Service {String(i + 1).padStart(2, "0")}</div>
                    <h2 className="text-2xl lg:text-4xl font-extrabold text-txt tracking-tight mb-6 leading-tight">
                      {s.title}
                    </h2>
                    <p className="text-txtsec text-[.92rem] leading-[1.9] mb-8 max-w-md">
                      {s.description}
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-3 mb-10">
                      {s.features.map((f, j) => (
                        <div key={j} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-orange flex-shrink-0" />
                          <span className="text-txt text-[.82rem] font-medium">{f}</span>
                        </div>
                      ))}
                    </div>

                    <Link href={`/${locale}/contact`}
                      className="inline-flex items-center gap-3 text-orange text-[.8rem] font-semibold uppercase tracking-wider group">
                      {t("learnMore")}
                      <span className="w-8 h-px bg-orange group-hover:w-14 transition-all duration-300" />
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </section>
        ))
      )}

      {/* CTA */}
      <section className="relative h-[350px] overflow-hidden">
        <Image src="/images/hero-generators.png" alt="Contact" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 h-full container flex flex-col items-center justify-center text-center">
          <AnimatedSection>
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white mb-4 tracking-tight">{t("ctaTitle")}</h3>
            <p className="text-white/35 mb-8">
              {t("ctaPhone")} <span className="text-orange font-bold">+213 551 99 55 68</span>
            </p>
            <Link href={`/${locale}/contact`} className="btn btn-primary">{t("ctaButton")}</Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
