"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const nav = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" },
  { href: "/admin/dashboard/content", label: "Contenu", icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H5.625a2.25 2.25 0 01-2.25-2.25V7.875c0-.621.504-1.125 1.125-1.125H7.5" },
  { href: "/admin/dashboard/products", label: "Produits", icon: "M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" },
  { href: "/admin/dashboard/services", label: "Services", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
  { href: "/admin/dashboard/media", label: "Médias", icon: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6v12.75c0 1.243 1.007 2.25 2.25 2.25z" },
  { href: "/admin/dashboard/messages", label: "Messages", icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin");
        return;
      }
      setUserEmail(session.user.email ?? null);
      setLoading(false);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 animate-spin text-orange" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-txtmuted text-[.8rem]">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-[72px]" : "w-[260px]"} flex-shrink-0 bg-[var(--navy-dark)] border-r border-[var(--border)] flex flex-col transition-all duration-300`}>
        {/* Header */}
        <div className="h-16 flex items-center px-4 border-b border-[var(--border)] gap-2">
          {!collapsed && (
            <Image src="/main_logo.png" alt="NASMO" width={110} height={28} className="h-6 w-auto brightness-0 invert" />
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center hover:bg-[var(--orange)]/10 transition-colors ml-auto">
            <svg className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${collapsed ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(n => {
            const active = pathname === n.href;
            return (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[.82rem] font-medium transition-all duration-200 ${
                  active
                    ? "bg-[var(--orange)]/10 text-[var(--orange)] border border-[var(--orange)]/15"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-white/[0.04] border border-transparent"
                }`}>
                <svg className={`w-[18px] h-[18px] flex-shrink-0 ${active ? "text-[var(--orange)]" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={n.icon} />
                </svg>
                {!collapsed && <span>{n.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border)]">
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[.82rem] font-medium text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/[0.06] transition-all`}>
            <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar — sticky */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md">
          {/* Left: breadcrumb */}
          <div className="flex items-center gap-3">
            <h2 className="text-[.9rem] font-semibold text-[var(--text-primary)]">Administration</h2>
            <span className="text-txtmuted text-[.7rem]">•</span>
            <span className="text-[.78rem] text-txtsec capitalize">
              {pathname === "/admin/dashboard" ? "Vue d'ensemble" : pathname.split("/").pop()?.replace(/-/g, " ")}
            </span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-[var(--bg-alt)] border border-[var(--border)] rounded-xl px-3 py-1.5">
              <svg className="w-3.5 h-3.5 text-txtmuted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input type="text" placeholder="Rechercher..." className="bg-transparent text-[.78rem] text-[var(--text-primary)] placeholder:text-txtmuted outline-none w-36 lg:w-48" />
            </div>

            {/* Date */}
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[.72rem] text-[var(--text-primary)] font-medium">
                {new Date().toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
              </span>
              <span className="text-[.65rem] text-txtmuted">
                {new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            <div className="w-px h-8 bg-[var(--border)]" />

            {/* Visit site */}
            <Link href="/en" target="_blank" className="hidden sm:flex items-center gap-1.5 text-[.75rem] text-txtsec hover:text-orange transition-colors px-2.5 py-1.5 rounded-lg hover:bg-orange/5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              View site
            </Link>

            {/* Profile */}
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center ring-2 ring-orange/20">
                <span className="text-[.65rem] font-bold text-orange">A</span>
              </div>
              <div className="hidden md:block">
                <div className="text-[.78rem] font-semibold text-[var(--text-primary)] group-hover:text-orange transition-colors leading-tight">Admin</div>
                <div className="text-[.65rem] text-txtmuted leading-tight truncate max-w-[120px]">{userEmail}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
