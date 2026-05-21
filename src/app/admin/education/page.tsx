"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";

interface Education {
  id: number;
  degree: string;
  institution: string;
  year: string;
  sortOrder: number;
}

export default function AdminEducation() {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Education> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/education");
      setItems(await res.json());
    } catch (err) {
      console.error("Failed to fetch education:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editing?.degree || !editing?.institution || !editing?.year) return;
    setSaving(true);
    try {
      const method = isCreating ? "POST" : "PUT";
      const res = await fetch("/api/admin/education", {
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
      const res = await fetch(`/api/admin/education?id=${id}`, { method: "DELETE" });
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
        <h1 className="text-white font-bold text-lg">Manage Education</h1>
        <button
          onClick={() => { setIsCreating(true); setEditing({ degree: "", institution: "", year: "", sortOrder: 0 }); }}
          className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
          style={{ background: "rgba(71,184,255,0.1)", border: "1px solid rgba(71,184,255,0.3)", color: "#47b8ff" }}
        >
          + New Education
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={!!editing}
        onClose={() => { setEditing(null); setIsCreating(false); }}
        title={isCreating ? "Create Education" : "Edit Education"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm mb-1">Degree *</label>
            <input
              type="text"
              value={editing?.degree || ""}
              onChange={(e) => setEditing({ ...editing, degree: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-1">Institution *</label>
            <input
              type="text"
              value={editing?.institution || ""}
              onChange={(e) => setEditing({ ...editing, institution: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-1">Year *</label>
              <input
                type="text"
                value={editing?.year || ""}
                onChange={(e) => setEditing({ ...editing, year: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Sort Order</label>
              <input
                type="number"
                value={editing?.sortOrder ?? 0}
                onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !editing?.degree || !editing?.institution || !editing?.year}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50"
              style={{ background: "rgba(71,184,255,0.1)", border: "1px solid rgba(71,184,255,0.3)", color: "#47b8ff" }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => { setEditing(null); setIsCreating(false); }}
              className="px-5 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="portfolio-card p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm">{item.degree}</h3>
              <p className="text-white/60 text-xs mt-0.5">{item.institution} — {item.year}</p>
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
        {items.length === 0 && <p className="text-white/60 text-center py-8">No education records yet.</p>}
      </div>
    </div>
  );
}
