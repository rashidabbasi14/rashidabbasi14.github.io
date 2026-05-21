"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "@/components/RichTextEditor";

interface Certification {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  url: string | null;
  tags: string[] | null;
  sortOrder: number;
}

export default function AdminCertifications() {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Certification> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/certifications");
      setItems(await res.json());
    } catch (err) {
      console.error("Failed to fetch certifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editing?.title) return;
    setSaving(true);
    try {
      const method = isCreating ? "POST" : "PUT";
      const res = await fetch("/api/admin/certifications", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (res.ok) {
        setEditing(null);
        setIsCreating(false);
        await fetchItems();
      }
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/certifications?id=${id}`, { method: "DELETE" });
      if (res.ok) await fetchItems();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0e1726" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: "#47b8ff" }} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white font-bold text-lg">Manage Certifications</h1>
        <button
          onClick={() => { setIsCreating(true); setEditing({ title: "", sortOrder: 0 }); }}
          className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
          style={{ background: "rgba(71,184,255,0.1)", border: "1px solid rgba(71,184,255,0.3)", color: "#47b8ff" }}
        >
          + New Certification
        </button>
      </div>

      {(editing || isCreating) && (
        <div className="portfolio-card p-6 mb-6">
          <h2 className="text-white font-semibold text-lg mb-4">{isCreating ? "Create" : "Edit"} Certification</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm mb-1">Title *</label>
                <input
                  type="text"
                  value={editing?.title || ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editing?.subtitle || ""}
                  onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm mb-1">Image URL</label>
                <input
                  type="text"
                  value={editing?.image || ""}
                  onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-1">URL</label>
                <input
                  type="text"
                  value={editing?.url || ""}
                  onChange={(e) => setEditing({ ...editing, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm mb-1">Description <span className="text-white/40 text-xs">(HTML supported)</span></label>
                <RichTextEditor
                  value={editing?.description || ""}
                  onChange={(value) => setEditing({ ...editing, description: value })}
                  rows={3}
                  placeholder="Certification details... HTML tags like <b>, <i> are supported"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={editing?.tags?.join(", ") || ""}
                  onChange={(e) => setEditing({
                    ...editing,
                    tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })}
                  className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
                  placeholder="e.g. JavaScript, React, Node.js"
                />
              </div>
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Sort Order</label>
              <input
                type="number"
                value={editing?.sortOrder ?? 0}
                onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-24 px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving || !editing?.title}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50"
                style={{ background: "rgba(71,184,255,0.1)", border: "1px solid rgba(71,184,255,0.3)", color: "#47b8ff" }}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => { setEditing(null); setIsCreating(false); }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="portfolio-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {item.image && (
                <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              )}
              <div className="min-w-0">
                <h3 className="text-white font-semibold text-sm truncate">{item.title}</h3>
                {item.subtitle && <p className="text-white/60 text-xs truncate">{item.subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <button
                onClick={() => { setIsCreating(false); setEditing(item); }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                style={{ background: "rgba(71,184,255,0.1)", border: "1px solid rgba(71,184,255,0.3)", color: "#47b8ff" }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                style={{ background: "rgba(255,71,71,0.1)", border: "1px solid rgba(255,71,71,0.3)", color: "#ff4747" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/60 text-center py-8">No certifications yet.</p>}
      </div>
    </div>
  );
}
