"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const locale = useLocale();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [contactInfo, setContactInfo] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    supabase.from("site_content").select("key, value, label").eq("section", "contact").order("sort_order").then(({ data }) => {
      if (data) setContactInfo(data.map(d => ({ label: d.label, value: d.value })));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    const { error: dbError } = await supabase.from("messages").insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
    });

    if (dbError) {
      setError(locale === "fr" ? "Erreur lors de l'envoi. Veuillez réessayer." : "Error sending message. Please try again.");
      setSending(false);
      return;
    }

    setSent(true);
    setSending(false);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[550px] overflow-hidden bg-black">
        <Image src="/images/hero-generators.png" alt="Contact" fill className="object-cover opacity-60 lg:hidden" sizes="100vw" />
        <Image src="/images/hero3.jpg" alt="Contact" fill className="object-cover opacity-60 hidden lg:block" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
        <div className="relative z-10 h-full container flex flex-col justify-end pb-14">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
            <div className="section-label text-white/40 mb-5">Contact</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
              Contactez-nous
            </h1>
            <p className="text-white/35 mt-4 max-w-lg text-base">Notre équipe est à votre écoute</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Bar */}
      <section className="bg-bgalt border-b border-line">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px">
            {contactInfo.map((c, i) => (
              <AnimatedSection key={i}>
                <div className="py-8 px-4 lg:px-6 text-center">
                  <div className="text-[.65rem] text-txtmuted font-bold uppercase tracking-[.2em] mb-2">{c.label}</div>
                  <div className="text-txt text-sm font-semibold">{c.value}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Map + Form */}
      <section className="section-lg bg-bg">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map */}
            <AnimatedSection>
              <div className="overflow-hidden border border-line h-full min-h-[460px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.272!2d2.97!3d36.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQ1JzAwLjAiTiAywrA1OCcxMi4wIkU!5e0!3m2!1sfr!2sdz!4v1"
                  width="100%" height="100%"
                  style={{ border: 0, minHeight: "460px" }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="NASMO" />
              </div>
            </AnimatedSection>

            {/* Form */}
            <AnimatedSection>
              <div className="bg-surface border border-line p-8 lg:p-10">
                <h2 className="text-xl font-extrabold text-txt mb-2 tracking-tight">
                  {locale === "ar" ? "أرسل لنا رسالة" : locale === "en" ? "Send us a message" : "Envoyez-nous un message"}
                </h2>
                <p className="text-txtmuted text-sm mb-8">Notre équipe est à votre écoute pour tout renseignement</p>

                {/* Success message */}
                {sent && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-[.84rem] rounded-lg">
                    {locale === "fr" ? "Message envoyé avec succès ! Nous vous répondrons bientôt." : "Message sent successfully! We'll get back to you soon."}
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[.84rem] rounded-lg">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-txtsec text-[.7rem] font-bold uppercase tracking-[.15em] mb-2">Nom</label>
                      <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Votre nom" className="input" />
                    </div>
                    <div>
                      <label className="block text-txtsec text-[.7rem] font-bold uppercase tracking-[.15em] mb-2">Email</label>
                      <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="votre@email.com" className="input" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-txtsec text-[.7rem] font-bold uppercase tracking-[.15em] mb-2">Téléphone</label>
                      <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+213 5XX XX XX XX" className="input" />
                    </div>
                    <div>
                      <label className="block text-txtsec text-[.7rem] font-bold uppercase tracking-[.15em] mb-2">Sujet</label>
                      <input type="text" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Sujet de votre message" className="input" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-txtsec text-[.7rem] font-bold uppercase tracking-[.15em] mb-2">Message</label>
                    <textarea rows={5} required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Votre message..." className="input resize-none" />
                  </div>
                  <button type="submit" disabled={sending} className="btn btn-primary w-full disabled:opacity-70">
                    {sending ? (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Envoi en cours...
                      </div>
                    ) : (
                      <>
                        Envoyer
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
