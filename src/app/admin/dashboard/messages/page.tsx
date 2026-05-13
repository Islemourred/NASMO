"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("messages").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setMessages(data ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = filter === "all" ? messages : messages.filter(m => filter === "unread" ? !m.read : m.read);
  const unreadCount = messages.filter(m => !m.read).length;
  const selectedMsg = messages.find(m => m.id === selected);

  const markRead = async (id: string) => {
    await supabase.from("messages").update({ read: true }).eq("id", id);
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const deleteMessage = async (id: string) => {
    await supabase.from("messages").delete().eq("id", id);
    setMessages(msgs => msgs.filter(m => m.id !== id));
    if (selected === id) setSelected(null);
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return "À l'instant";
    if (h < 24) return `Il y a ${h}h`;
    return `Il y a ${Math.floor(h / 24)}j`;
  };

  if (loading) return <div className="flex justify-center py-20"><svg className="w-6 h-6 animate-spin text-orange" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">Messages</h1>
          <p className="text-txtmuted text-[.84rem] mt-1">{unreadCount} message{unreadCount !== 1 ? "s" : ""} non lu{unreadCount !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-0.5">
          {([["all", "Tous"], ["unread", "Non lus"], ["read", "Lus"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1.5 rounded-md text-[.75rem] font-medium transition-all ${filter === key ? "bg-orange/10 text-orange" : "text-txtmuted hover:text-txtsec"}`}>{label}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5" style={{ minHeight: '500px' }}>
        <div className="lg:col-span-1 card p-2 overflow-y-auto" style={{ maxHeight: '600px' }}>
          <div className="space-y-1">
            {filtered.map(m => (
              <button key={m.id} onClick={() => { setSelected(m.id); markRead(m.id); }} className={`w-full text-left p-3 rounded-xl transition-all ${selected === m.id ? "bg-orange/10 border border-orange/15" : "hover:bg-[var(--bg-alt)] border border-transparent"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${!m.read ? "bg-orange/10" : "bg-[var(--surface-raised)]"}`}>
                    <span className={`text-[.55rem] font-bold ${!m.read ? "text-orange" : "text-txtmuted"}`}>{m.name.split(' ').map(w => w[0]).join('')}</span>
                  </div>
                  <span className="text-[.8rem] font-semibold text-[var(--text-primary)] truncate flex-1">{m.name}</span>
                  {!m.read && <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />}
                </div>
                <p className="text-[.75rem] font-medium text-txtsec truncate pl-9">{m.subject}</p>
                <p className="text-[.68rem] text-txtmuted pl-9 mt-0.5">{timeAgo(m.created_at)}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 card p-6">
          {selectedMsg ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={selectedMsg.id}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] text-[1.1rem] mb-1">{selectedMsg.subject}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-[.78rem] text-txtmuted">
                    <span>{selectedMsg.name}</span>
                    <span>{selectedMsg.email}</span>
                    <span>{selectedMsg.phone}</span>
                  </div>
                </div>
                <button onClick={() => deleteMessage(selectedMsg.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 text-txtmuted hover:text-red-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
                </button>
              </div>
              <div className="border-t border-[var(--border)] pt-5">
                <p className="text-[.88rem] text-txtsec leading-relaxed">{selectedMsg.message}</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg-alt)] flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-txtmuted" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
              </div>
              <p className="text-txtsec text-[.88rem] font-medium">Sélectionnez un message</p>
              <p className="text-txtmuted text-[.78rem] mt-1">Cliquez sur un message pour le lire</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
