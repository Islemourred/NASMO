"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();

  const cards = [
    { icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z", label: t("info.address"), vals: [t("info.addressValue")], color: "from-orange/10 to-orange/5" },
    { icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z", label: t("info.phone"), vals: [t("info.phoneValue"), t("info.mobile")], color: "from-navy/10 to-navy/5" },
    { icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75", label: t("info.email"), vals: [t("info.emailValue"), t("info.emailValue2")], color: "from-orange/10 to-orange/5" },
    { icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", label: t("info.technical"), vals: [t("info.technicalValue")], color: "from-navy/10 to-navy/5" },
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

      {/* Contact Cards */}
      <section className="relative -mt-10 z-10 pb-6">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c, i) => (
              <AnimatedSection key={i} delay={i * .06}>
                <div className="card p-5 group hover:border-orange/15 h-full hover:shadow-lg transition-all duration-400">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <svg className="w-5 h-5 text-orange" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={c.icon}/>
                    </svg>
                  </div>
                  <div className="text-[.68rem] text-txtmuted font-semibold uppercase tracking-widest mb-2">{c.label}</div>
                  {c.vals.map((v, j) => (
                    <p key={j} className="text-txt text-[.82rem] font-medium leading-relaxed">{v}</p>
                  ))}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Map + Form */}
      <section className="section-lg bg-bg relative">
        <div className="absolute inset-0 dot-grid opacity-[0.025] pointer-events-none" />
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {/* Map */}
            <AnimatedSection direction="left">
              <div className="rounded-2xl overflow-hidden border border-line h-full min-h-[420px] shadow-lg ring-1 ring-black/5">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.272!2d2.97!3d36.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQ1JzAwLjAiTiAywrA1OCcxMi4wIkU!5e0!3m2!1sfr!2sdz!4v1"
                  width="100%" height="100%"
                  style={{ border: 0, minHeight: "420px" }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ENTRELEC" />
              </div>
            </AnimatedSection>

            {/* Form */}
            <AnimatedSection direction="right" delay={.1}>
              <div className="card p-6 sm:p-8 hover:shadow-xl transition-shadow duration-500">
                <h2 className="text-lg font-extrabold text-txt mb-1">
                  {locale === "ar" ? "أرسل لنا رسالة" : locale === "en" ? "Send us a message" : "Envoyez-nous un message"}
                </h2>
                <p className="text-txtmuted text-[.82rem] mb-7">{t("subtitle")}</p>
                <form className="space-y-4">
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
                    <textarea rows={5} placeholder={t("form.message")} className="input resize-none" />
                  </div>
                  <button type="submit" className="btn btn-primary w-full text-[.84rem]">
                    {t("form.send")}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                    </svg>
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
