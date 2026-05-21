"use client";

import { useState, useEffect, useRef } from "react";
import Modal from "@/components/Modal";

interface Employment {
  id: number;
  title: string;
  company: string;
  duration: string | null;
  description: string | null;
  image: string | null;
  isCurrent: boolean;
  sortOrder: number;
}

export default function AdminEmployment() {
  const [items, setItems] = useState<Employment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Employment> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/employment");
      setItems(await res.json());
    } catch (err) {
      console.error("Failed to fetch employment:", err);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url || null;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file);
    if (url) {
      setEditing((prev) => ({ ...prev, image: url }));
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = () => {
    setEditing((prev) => ({ ...prev, image: null }));
  };

  const handleSave = async () => {
    if (!editing?.title || !editing?.company) return;
    setSaving(true);
    try {
      const method = isCreating ? "POST" : "PUT";
      const res = await fetch("/api/admin/employment", {
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
      const res = await fetch(`/api/admin/employment?id=${id}`, { method: "DELETE" });
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
        <h1 className="text-white font-bold text-lg">Manage Employment</h1>
        <button
          onClick={() => { setIsCreating(true); setEditing({ title: "", company: "", isCurrent: false, sortOrder: 0, image: null }); }}
          className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
          style={{ background: "rgba(71,184,255,0.1)", border: "1px solid rgba(71,184,255,0.3)", color: "#47b8ff" }}
        >
          + New Employment
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={!!editing}
        onClose={() => { setEditing(null); setIsCreating(false); }}
        title={isCreating ? "Create Employment" : "Edit Employment"}
        image={editing?.image}
        imageShape="circle"
        imageWidth={100}
      >
        <div className="space-y-4">
          {/* Image upload controls (shown below the preview) */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Or paste image URL..."
              value={editing?.image || ""}
              onChange={(e) => setEditing({ ...editing, image: e.target.value || null })}
              className="flex-1 min-w-[200px] px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 whitespace-nowrap"
              style={{ background: "rgba(71,184,255,0.1)", border: "1px solid rgba(71,184,255,0.3)", color: "#47b8ff" }}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            {editing?.image && (
              <button
                onClick={handleRemoveImage}
                className="px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap"
                style={{ background: "rgba(255,71,71,0.1)", border: "1px solid rgba(255,71,71,0.3)", color: "#ff4747" }}
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-1">Title *</label>
              <input type="text" value={editing?.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Company *</label>
              <input type="text" value={editing?.company || ""} onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-1">Duration</label>
              <input type="text" value={editing?.duration || ""} onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Sort Order</label>
              <input type="number" value={editing?.sortOrder ?? 0} onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
            </div>
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-1">Description</label>
            <textarea rows={3} value={editing?.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2 resize-none"
              style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
          </div>
          <label className="flex items-center gap-2 text-white/80 text-sm">
            <input type="checkbox" checked={editing?.isCurrent || false} onChange={(e) => setEditing({ ...editing, isCurrent: e.target.checked })}
              className="rounded accent-[#47b8ff]" />
            Current Role
          </label>
          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} disabled={saving || !editing?.title || !editing?.company}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50"
              style={{ background: "rgba(71,184,255,0.1)", border: "1px solid rgba(71,184,255,0.3)", color: "#47b8ff" }}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => { setEditing(null); setIsCreating(false); }}
              className="px-5 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all duration-200 cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="portfolio-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.company}
                  className="rounded-full object-cover flex-shrink-0"
                  style={{ width: "44px", height: "44px", border: "2px solid rgba(71,184,255,0.2)" }}
                />
              ) : (
                <div
                  className="rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    backgroundColor: "#0d6efd",
                    fontSize: "14px",
                  }}
                >
                  {item.company.split(/\s+/).map((w) => w[0] || "").join("").slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-semibold text-sm truncate">{item.title}</h3>
                  {item.isCurrent && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: "rgba(71,184,255,0.15)", color: "#47b8ff" }}>Current</span>
                  )}
                </div>
                <p className="text-white/60 text-xs mt-0.5 truncate">{item.company}{item.duration ? ` — ${item.duration}` : ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <button onClick={() => { setIsCreating(false); setEditing(item); }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                style={{ background: "rgba(71,184,255,0.1)", border: "1px solid rgba(71,184,255,0.3)", color: "#47b8ff" }}>Edit</button>
              <button onClick={() => handleDelete(item.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                style={{ background: "rgba(255,71,71,0.1)", border: "1px solid rgba(255,71,71,0.3)", color: "#ff4747" }}>Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-white/60 text-center py-8">No employment records yet.</p>}
      </div>
    </div>
  );
}
