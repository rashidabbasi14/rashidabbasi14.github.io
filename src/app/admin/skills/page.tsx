"use client";

import { useState, useEffect, useRef } from "react";
import Modal from "@/components/Modal";

interface SkillItem {
  id: number;
  categoryId: number;
  name: string;
  image: string;
  sortOrder: number;
}

interface SkillCategory {
  id: number;
  name: string;
  sortOrder: number;
  items: SkillItem[];
}

export default function AdminSkills() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Partial<SkillCategory> | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<SkillItem> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [creatingSkill, setCreatingSkill] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/admin/skills");
      setCategories(await res.json());
    } catch (err) {
      console.error("Failed to fetch skills:", err);
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

  const handleSkillImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file);
    if (url) {
      setEditingSkill((prev) => ({ ...prev, image: url }));
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveSkillImage = () => {
    setEditingSkill((prev) => ({ ...prev, image: "" }));
  };

  const handleSaveCategory = async () => {
    if (!editingCategory?.name) return;
    setSaving(true);
    try {
      const method = isCreating ? "POST" : "PUT";
      const res = await fetch("/api/admin/skills", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingCategory, type: "category" }),
      });
      if (res.ok) {
        setEditingCategory(null);
        setIsCreating(false);
        await fetchSkills();
      }
    } catch (err) {
      console.error("Failed to save category:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSkill = async () => {
    if (!editingSkill?.name || !editingSkill?.categoryId) return;
    setSaving(true);
    try {
      const method = creatingSkill ? "POST" : "PUT";
      const res = await fetch("/api/admin/skills", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editingSkill, type: "skill" }),
      });
      if (res.ok) {
        setEditingSkill(null);
        setCreatingSkill(false);
        await fetchSkills();
      }
    } catch (err) {
      console.error("Failed to save skill:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Delete this category and all its skills?")) return;
    try {
      const res = await fetch(`/api/admin/skills?id=${id}&type=category`, { method: "DELETE" });
      if (res.ok) await fetchSkills();
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/skills?id=${id}&type=skill`, { method: "DELETE" });
      if (res.ok) await fetchSkills();
    } catch (err) {
      console.error("Failed to delete skill:", err);
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
        <h1 className="text-white font-bold text-lg">Manage Skills</h1>
        <button onClick={() => { setIsCreating(true); setEditingCategory({ name: "", sortOrder: 0 }); }}
          className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
          style={{ background: "rgba(71,184,255,0.1)", border: "1px solid rgba(71,184,255,0.3)", color: "#47b8ff" }}>
          + New Category
        </button>
      </div>

      {/* Category Modal */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => { setEditingCategory(null); setIsCreating(false); }}
        title={isCreating ? "Create Category" : "Edit Category"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm mb-1">Name *</label>
            <input type="text" value={editingCategory?.name || ""} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
              autoFocus />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-1">Sort Order</label>
            <input type="number" value={editingCategory?.sortOrder ?? 0} onChange={(e) => setEditingCategory({ ...editingCategory, sortOrder: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleSaveCategory} disabled={saving || !editingCategory?.name}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50"
              style={{ background: "rgba(71,184,255,0.1)", border: "1px solid rgba(71,184,255,0.3)", color: "#47b8ff" }}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => { setEditingCategory(null); setIsCreating(false); }}
              className="px-5 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all duration-200 cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Skill Modal */}
      <Modal
        isOpen={!!editingSkill}
        onClose={() => { setEditingSkill(null); setCreatingSkill(false); }}
        title={creatingSkill ? "Create Skill" : "Edit Skill"}
        image={editingSkill?.image || null}
        imageShape="circle"
        imageWidth={60}
      >
        <div className="space-y-4">
          {/* Image upload controls */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Or paste image URL..."
              value={editingSkill?.image || ""}
              onChange={(e) => setEditingSkill({ ...editingSkill, image: e.target.value })}
              className="flex-1 min-w-[200px] px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleSkillImageUpload}
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
            {editingSkill?.image && (
              <button
                onClick={handleRemoveSkillImage}
                className="px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap"
                style={{ background: "rgba(255,71,71,0.1)", border: "1px solid rgba(255,71,71,0.3)", color: "#ff4747" }}
              >
                Remove
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-1">Name *</label>
              <input type="text" value={editingSkill?.name || ""} onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Category</label>
              <select value={editingSkill?.categoryId || ""} onChange={(e) => setEditingSkill({ ...editingSkill, categoryId: parseInt(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-1">Sort Order</label>
            <input type="number" value={editingSkill?.sortOrder ?? 0} onChange={(e) => setEditingSkill({ ...editingSkill, sortOrder: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleSaveSkill} disabled={saving || !editingSkill?.name || !editingSkill?.categoryId}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50"
              style={{ background: "rgba(71,184,255,0.1)", border: "1px solid rgba(71,184,255,0.3)", color: "#47b8ff" }}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => { setEditingSkill(null); setCreatingSkill(false); }}
              className="px-5 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all duration-200 cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Categories List */}
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.id} className="portfolio-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold">{cat.name}</h3>
                <p className="text-white/50 text-xs">{cat.items.length} skills</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => {
                  setCreatingSkill(true);
                  setEditingSkill({ name: "", image: "", categoryId: cat.id, sortOrder: 0 });
                }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                  style={{ background: "rgba(71,184,255,0.1)", border: "1px solid rgba(71,184,255,0.3)", color: "#47b8ff" }}>
                  + Skill
                </button>
                <button onClick={() => { setIsCreating(false); setEditingCategory(cat); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                  style={{ background: "rgba(71,184,255,0.1)", border: "1px solid rgba(71,184,255,0.3)", color: "#47b8ff" }}>
                  Edit
                </button>
                <button onClick={() => handleDeleteCategory(cat.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                  style={{ background: "rgba(255,71,71,0.1)", border: "1px solid rgba(255,71,71,0.3)", color: "#ff4747" }}>
                  Delete
                </button>
              </div>
            </div>
            {cat.items.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {cat.items.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                    style={{ background: "rgba(71,184,255,0.08)", border: "1px solid rgba(71,184,255,0.15)" }}>
                    {skill.image ? (
                      <img
                        src={skill.image}
                        alt={skill.name}
                        className="rounded-full object-cover flex-shrink-0"
                        style={{ width: "20px", height: "20px" }}
                      />
                    ) : (
                      <div
                        className="rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0"
                        style={{ width: "20px", height: "20px", backgroundColor: "rgba(71,184,255,0.2)", color: "#47b8ff" }}
                      >
                        {skill.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="text-white/80">{skill.name}</span>
                    <button onClick={() => { setCreatingSkill(false); setEditingSkill(skill); }}
                      className="text-white/40 hover:text-white transition-colors cursor-pointer">✎</button>
                    <button onClick={() => handleDeleteSkill(skill.id)}
                      className="text-white/40 hover:text-red-400 transition-colors cursor-pointer">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {categories.length === 0 && <p className="text-white/60 text-center py-8">No skill categories yet.</p>}
      </div>
    </div>
  );
}
