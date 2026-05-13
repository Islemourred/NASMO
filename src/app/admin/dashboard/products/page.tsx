"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  sub_category: string;
  description: string;
  power: string;
  image_url: string;
  brand: string;
  active: boolean;
}

const catOptions = ["stabilisateurs", "variateurs", "groupes", "onduleurs", "augier"];

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({ name: "", category: "onduleurs", sub_category: "", description: "", power: "", image_url: "/images/product-cyclone.png", brand: "" });

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("sort_order");
    setProducts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("products").update({ active: !current }).eq("id", id);
    setProducts(products.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    setProducts(products.filter(p => p.id !== id));
  };

  const addProduct = async () => {
    if (!newProduct.name) return;
    const slug = newProduct.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const { data } = await supabase.from("products").insert({
      ...newProduct, slug, active: true, sort_order: products.length + 1,
    }).select().single();
    if (data) setProducts([...products, data]);
    setNewProduct({ name: "", category: "onduleurs", sub_category: "", description: "", power: "", image_url: "/images/product-cyclone.png", brand: "" });
    setShowAdd(false);
  };

  const saveEdit = async (id: string, field: string, value: string) => {
    await supabase.from("products").update({ [field]: value }).eq("id", id);
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">Produits</h1>
          <p className="text-txtmuted text-[.84rem] mt-1">Gérez votre catalogue de produits ({products.length})</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn btn-primary text-[.8rem]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter un produit
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-txtmuted pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
          className="input" style={{ paddingLeft: '2.5rem' }} />
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="card p-6 border-orange/20">
            <h3 className="font-bold text-[var(--text-primary)] mb-4">Nouveau produit</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-txtsec text-[.7rem] font-semibold uppercase tracking-wider mb-1.5">Nom</label>
                <input className="input" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Nom du produit" />
              </div>
              <div>
                <label className="block text-txtsec text-[.7rem] font-semibold uppercase tracking-wider mb-1.5">Catégorie</label>
                <select className="input" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                  {catOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-txtsec text-[.7rem] font-semibold uppercase tracking-wider mb-1.5">Marque</label>
                <input className="input" value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} placeholder="DELTA, NASMO..." />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-txtsec text-[.7rem] font-semibold uppercase tracking-wider mb-1.5">Puissance</label>
                <input className="input" value={newProduct.power} onChange={e => setNewProduct({ ...newProduct, power: e.target.value })} placeholder="100 KVA" />
              </div>
              <div>
                <label className="block text-txtsec text-[.7rem] font-semibold uppercase tracking-wider mb-1.5">Description</label>
                <input className="input" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Description" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={addProduct} className="btn btn-primary text-[.78rem]">Ajouter</button>
              <button onClick={() => setShowAdd(false)} className="btn btn-secondary text-[.78rem]">Annuler</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left text-[.7rem] font-semibold text-txtmuted uppercase tracking-wider p-4">Produit</th>
                <th className="text-left text-[.7rem] font-semibold text-txtmuted uppercase tracking-wider p-4">Catégorie</th>
                <th className="text-left text-[.7rem] font-semibold text-txtmuted uppercase tracking-wider p-4">Description</th>
                <th className="text-left text-[.7rem] font-semibold text-txtmuted uppercase tracking-wider p-4">Statut</th>
                <th className="text-right text-[.7rem] font-semibold text-txtmuted uppercase tracking-wider p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-alt)] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--bg-alt)] flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Image src={p.image_url} alt={p.name} width={32} height={32} className="object-contain" />
                      </div>
                      {editId === p.id ? (
                        <input className="input text-[.82rem]" value={p.name} onChange={e => saveEdit(p.id, "name", e.target.value)} style={{ padding: '.4rem .6rem' }} />
                      ) : (
                        <div>
                          <span className="text-[.84rem] font-semibold text-[var(--text-primary)] block">{p.name}</span>
                          <span className="text-[.7rem] text-orange/60">{p.brand}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[.72rem] px-2.5 py-1 rounded-full bg-[var(--surface-raised)] text-txtsec font-medium border border-[var(--border)]">{p.category}</span>
                  </td>
                  <td className="p-4">
                    {editId === p.id ? (
                      <input className="input text-[.82rem]" value={p.description} onChange={e => saveEdit(p.id, "description", e.target.value)} style={{ padding: '.4rem .6rem' }} />
                    ) : (
                      <span className="text-[.82rem] text-txtmuted">{p.description}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <button onClick={() => toggleActive(p.id, p.active)}
                      className={`text-[.72rem] px-2.5 py-1 rounded-full font-semibold ${p.active ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                      {p.active ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditId(editId === p.id ? null : p.id)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${editId === p.id ? "bg-orange/10 text-orange" : "hover:bg-[var(--surface-raised)] text-txtmuted"}`}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button onClick={() => deleteProduct(p.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 text-txtmuted hover:text-red-400 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
