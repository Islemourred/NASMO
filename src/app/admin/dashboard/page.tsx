"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface DashboardStats {
  products: number;
  services: number;
  messages: number;
  unread: number;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  read: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ products: 0, services: 0, messages: 0, unread: 0 });
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [productsRes, servicesRes, messagesRes, unreadRes, recentRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("active", true),
        supabase.from("services").select("id", { count: "exact", head: true }).eq("active", true),
        supabase.from("messages").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }).eq("read", false),
        supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      setStats({
        products: productsRes.count ?? 0,
        services: servicesRes.count ?? 0,
        messages: messagesRes.count ?? 0,
        unread: unreadRes.count ?? 0,
      });
      setRecentMessages(recentRes.data ?? []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const statCards = [
    { label: "Produits", val: stats.products.toString(), change: "Produits actifs", icon: "M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25", color: "orange" },
    { label: "Services", val: stats.services.toString(), change: "Services actifs", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", color: "orange" },
    { label: "Messages", val: stats.messages.toString(), change: `${stats.unread} non lus`, icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75", color: "orange" },
  ];

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "À l'instant";
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="w-6 h-6 animate-spin text-orange" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">Tableau de bord</h1>
        <p className="text-txtmuted text-[.84rem] mt-1">Vue d&apos;ensemble de votre plateforme</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .08 }}
            className="card p-5 hover:shadow-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[var(--text-primary)] mb-0.5">{s.val}</div>
            <div className="text-txtmuted text-[.75rem]">{s.label}</div>
            <div className="text-[.7rem] text-orange/70 mt-1 font-medium">{s.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Messages */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[var(--text-primary)] text-[.95rem]">Messages récents</h3>
          <span className="text-[.7rem] bg-orange/10 text-orange px-2.5 py-1 rounded-full font-semibold">{stats.unread} non lus</span>
        </div>
        <div className="space-y-1">
          {recentMessages.map((m) => (
            <div key={m.id} className={`flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-[var(--bg-alt)] cursor-pointer ${!m.read ? "bg-orange/[0.02]" : ""}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${!m.read ? "bg-orange/10" : "bg-[var(--surface-raised)]"}`}>
                <span className={`text-[.65rem] font-bold ${!m.read ? "text-orange" : "text-txtmuted"}`}>
                  {m.name.split(' ').map(w => w[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[.82rem] font-semibold text-[var(--text-primary)] truncate">{m.name}</span>
                  {!m.read && <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />}
                </div>
                <p className="text-[.78rem] text-txtmuted truncate">{m.subject}</p>
              </div>
              <span className="text-[.7rem] text-txtmuted flex-shrink-0">{timeAgo(m.created_at)}</span>
            </div>
          ))}
          {recentMessages.length === 0 && (
            <p className="text-center text-txtmuted text-[.84rem] py-6">Aucun message</p>
          )}
        </div>
      </div>
    </div>
  );
}
