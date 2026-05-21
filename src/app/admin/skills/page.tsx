"use client";

import { useState, useEffect } from "react";

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

      {/* Category Edit/Create Form */}
      {(editingCategory || isCreating) && (
        <div className="portfolio-card p-6 mb-6">
          <h2 className="text-white font-semibold text-lg mb-4">{isCreating ? "Create" : "Edit"} Category</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm mb-1">Name *</label>
                <input type="text" value={editingCategory?.name || ""} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-1">Sort Order</label>
                <input type="number" value={editingCategory?.sortOrder ?? 0} onChange={(e) => setEditingCategory({ ...editingCategory, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-24 px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveCategory} disabled={saving || !editingCategory?.name}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50"
                style={{ background: "rgba(71,184,255,0.1)", border: "1px solid rgba(71,184,255,0.3)", color: "#47b8ff" }}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => { setEditingCategory(null); setIsCreating(false); }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all duration-200 cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill Edit/Create Form */}
      {(editingSkill || creatingSkill) && (
        <div className="portfolio-card p-6 mb-6">
          <h2 className="text-white font-semibold text-lg mb-4">{creatingSkill ? "Create" : "Edit"} Skill</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm mb-1">Image URL</label>
                <input type="text" value={editingSkill?.image || ""} onChange={(e) => setEditingSkill({ ...editingSkill, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-1">Sort Order</label>
                <input type="number" value={editingSkill?.sortOrder ?? 0} onChange={(e) => setEditingSkill({ ...editingSkill, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-24 px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveSkill} disabled={saving || !editingSkill?.name || !editingSkill?.categoryId}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50"
                style={{ background: "rgba(71,184,255,0.1)", border: "1px solid rgba(71,184,255,0.3)", color: "#47b8ff" }}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => { setEditingSkill(null); setCreatingSkill(false); }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all duration-200 cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
