"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  const nav = [
    { href: `/${locale}`, label: t("nav.home") },
    { href: `/${locale}/a-propos`, label: t("nav.about") },
    { href: `/${locale}/produits`, label: t("nav.products") },
    { href: `/${locale}/services`, label: t("nav.services") },
    { href: `/${locale}/contact`, label: t("nav.contact") },
  ];

  const cats = [
    t("footer.cat.stabilizers"),
    t("footer.cat.airport"),
    t("footer.cat.generators"),
    t("footer.cat.augier"),
    t("footer.cat.ups"),
  ];

  const socials = [
    { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z", label: "Facebook" },
    { d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z", label: "LinkedIn" },
    { d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z", label: "X" },
    { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z", label: "Instagram" },
    { d: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z", label: "YouTube" },
  ];

  return (
    <footer className="relative bg-[#04101f] text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-navy-light/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Top gradient bar */}
      <div className="h-px bg-gradient-to-r from-transparent via-orange/25 to-transparent" />

      <div className="container relative z-10 pt-16 pb-6">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 mb-16">
          {/* Brand col */}
          <div className="md:col-span-4">
            <Link href={`/${locale}`} className="inline-block mb-5 group">
              <Image src="/main_logo.png" alt="ENTRELEC" width={120} height={30}
                className="h-7 w-auto transition-opacity group-hover:opacity-70" />
            </Link>
            <p className="text-white/50 text-[.84rem] leading-relaxed mb-6 max-w-xs">
              {t("footer.description")}
            </p>
            <div className="flex gap-2">
              {socials.map((s, i) => (
                <a key={i} href="#" aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-orange/10 hover:border-orange/25 transition-all group">
                  <svg className="w-3.5 h-3.5 text-white/40 group-hover:text-orange transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Nav col */}
          <div className="md:col-span-2">
            <h4 className="text-[.7rem] font-semibold text-white/65 uppercase tracking-[.15em] mb-5">{t("footer.navigation")}</h4>
            <ul className="space-y-2.5">
              {nav.map(n => (
                <li key={n.href}>
                  <Link href={n.href} className="text-white/50 hover:text-orange text-[.84rem] transition-colors inline-flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 h-px bg-orange transition-all duration-300" />
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories col */}
          <div className="md:col-span-3">
            <h4 className="text-[.7rem] font-semibold text-white/65 uppercase tracking-[.15em] mb-5">{t("footer.categories")}</h4>
            <ul className="space-y-2.5">
              {cats.map(c => (
                <li key={c}>
                  <Link href={`/${locale}/produits`} className="text-white/50 hover:text-orange text-[.84rem] transition-colors inline-flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 h-px bg-orange transition-all duration-300" />
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact col */}
          <div className="md:col-span-3">
            <h4 className="text-[.7rem] font-semibold text-white/65 uppercase tracking-[.15em] mb-5">{t("footer.headquarters")}</h4>
            <div className="space-y-4">
              {[
                { icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z", text: t("contact.info.addressValue") },
                { icon: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z", text: "+213 (0) 23.11.67.60/68" },
                { icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75", text: "contact@entrelec.dz" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-orange/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </div>
                  <span className={`text-[.82rem] leading-relaxed ${i === 2 ? "text-orange/80" : "text-white/50"}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/35 text-[.75rem]">&copy; {new Date().getFullYear()} ENTRELEC. {t("footer.rights")}.</p>
          <p className="text-white/25 text-[.75rem]">{t("common.since")}</p>
        </div>
      </div>
    </footer>
  );
}
