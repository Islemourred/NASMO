"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/lib/supabase";
import { useSiteContent } from "@/lib/useContent";

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  image_url: string;
}

export default function ServiceDetailPage() {
  const locale = useLocale();
  const params = useParams();
  const slug = params.slug as string;
  const { content: contact } = useSiteContent("contact");
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("services").select("*").eq("id", slug).single().then(async ({ data }) => {
      if (data && locale !== "en") {
        try {
          const items = [
            { sourceTable: "services", sourceId: data.id, fieldName: "title", text: data.title },
            { sourceTable: "services", sourceId: data.id, fieldName: "description", text: data.description },
          ];
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items, locale }),
          });
          if (res.ok) {
            const { translations } = await res.json();
            data.title = translations[0];
            data.description = translations[1];
          }
        } catch {}
      }
      setService(data);
      setLoading(false);
    });
  }, [slug, locale]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <svg className="w-6 h-6 animate-spin text-orange" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-txt mb-4">Service not found</h1>
          <Link href={`/${locale}/services`} className="btn btn-primary">Back to services</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[550px] overflow-hidden bg-black">
        <Image src={service.image_url || "/images/service-electrical.png"} alt={service.title} fill className="object-cover opacity-60" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
        <div className="relative z-10 h-full container flex flex-col justify-end pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
            <Link href={`/${locale}/services`}
              className="inline-flex items-center gap-2 text-white/30 text-[.78rem] font-medium hover:text-orange transition-colors mb-5 uppercase tracking-wider">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              All services
            </Link>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
              {service.title}
            </h1>
            <p className="text-white/35 mt-4 max-w-xl text-base">{service.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-lg bg-bg">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2 space-y-14">
              <AnimatedSection>
                <div className="section-label mb-5">Overview</div>
                <p className="text-txtsec text-[.95rem] leading-[1.9]">{service.description}</p>
              </AnimatedSection>

              {service.features && service.features.length > 0 && (
                <AnimatedSection>
                  <div className="section-label mb-6">What we offer</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {service.features.map((f, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * .05 }}
                        className="border-t border-line pt-4 group">
                        <h3 className="text-[.88rem] font-bold text-txt mb-1 group-hover:text-orange transition-colors flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-orange flex-shrink-0" />
                          {f}
                        </h3>
                      </motion.div>
                    ))}
                  </div>
                </AnimatedSection>
              )}
            </div>

            {/* Sidebar */}
            <div>
              <AnimatedSection>
                <div className="bg-surface border border-line p-6 lg:p-8 sticky top-24">
                  <div className="section-label mb-5">Contact</div>
                  <div className="mt-4 space-y-3">
                    <Link href={`/${locale}/contact`} className="btn btn-primary w-full justify-center text-[.8rem]">
                      Request this service
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                    <a href={`tel:${(contact.phone || "+213551995568").replace(/[\s().]/g, "")}`} className="btn btn-secondary w-full justify-center text-[.8rem]">
                      Call
                    </a>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative h-[300px] overflow-hidden">
        <Image src="/images/hero-generators.png" alt="Contact" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 h-full container flex flex-col items-center justify-center text-center">
          <AnimatedSection>
            <h3 className="text-xl lg:text-2xl font-extrabold text-white mb-3 tracking-tight">Interested in this service?</h3>
            <p className="text-white/35 mb-6">
              <span className="text-orange font-bold">{contact.phone || "+213 551 99 55 68"}</span>
            </p>
            <Link href={`/${locale}/contact`} className="btn btn-primary">Contact Us</Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
