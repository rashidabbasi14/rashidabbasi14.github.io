"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "@/components/RichTextEditor";

interface Project {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  coverImage: string | null;
  images: string[] | null;
  technologies: string[] | null;
  githubUrl: string | null;
  liveUrl: string | null;
  priority: boolean;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      setProjects(await res.json());
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingProject?.title) return;
    setSaving(true);
    try {
      const method = isCreating ? "POST" : "PUT";
      const res = await fetch("/api/admin/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      });
      if (res.ok) {
        setEditingProject(null);
        setIsCreating(false);
        await fetchProjects();
      }
    } catch (err) {
      console.error("Failed to save project:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) await fetchProjects();
    } catch (err) {
      console.error("Failed to delete project:", err);
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
        <h1 className="text-white font-bold text-lg">Manage Projects</h1>
        <button
          onClick={() => { setIsCreating(true); setEditingProject({ title: "", technologies: [] }); }}
          className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
          style={{
            background: "rgba(71,184,255,0.1)",
            border: "1px solid rgba(71,184,255,0.3)",
            color: "#47b8ff",
          }}
        >
          + New Project
        </button>
      </div>

      {/* Edit/Create Form */}
      {(editingProject || isCreating) && (
        <div className="portfolio-card p-6 mb-6">
          <h2 className="text-white font-semibold text-lg mb-4">
            {isCreating ? "Create Project" : "Edit Project"}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm mb-1">Title *</label>
                <input
                  type="text"
                  value={editingProject?.title || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editingProject?.subtitle || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
                />
              </div>
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Description <span className="text-white/40 text-xs">(HTML supported)</span></label>
              <RichTextEditor
                value={editingProject?.description || ""}
                onChange={(value) => setEditingProject({ ...editingProject, description: value })}
                rows={4}
                placeholder="Describe the project... HTML tags like <b>, <i>, <ul> are supported"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={editingProject?.coverImage || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-1">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={editingProject?.technologies?.join(", ") || ""}
                  onChange={(e) => setEditingProject({
                    ...editingProject,
                    technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })}
                  className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
                />
              </div>
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Additional Images (one URL per line)</label>
              <textarea
                value={editingProject?.images?.join("\n") || ""}
                onChange={(e) => setEditingProject({
                  ...editingProject,
                  images: e.target.value.split("\n").map((t) => t.trim()).filter(Boolean),
                })}
                rows={3}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2 resize-y"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={editingProject?.githubUrl || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-1">Live URL</label>
                <input
                  type="text"
                  value={editingProject?.liveUrl || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-white/80 text-sm">
              <input
                type="checkbox"
                checked={editingProject?.priority || false}
                onChange={(e) => setEditingProject({ ...editingProject, priority: e.target.checked })}
                className="rounded accent-[#47b8ff]"
              />
              Priority (show first)
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving || !editingProject?.title}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50"
                style={{
                  background: "rgba(71,184,255,0.1)",
                  border: "1px solid rgba(71,184,255,0.3)",
                  color: "#47b8ff",
                }}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => { setEditingProject(null); setIsCreating(false); }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="portfolio-card p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm">{project.title}</h3>
              {project.subtitle && (
                <p className="text-white/60 text-xs mt-0.5">{project.subtitle}</p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="tag-badge text-[10px]">{tech}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <button
                onClick={() => { setIsCreating(false); setEditingProject(project); }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                style={{
                  background: "rgba(71,184,255,0.1)",
                  border: "1px solid rgba(71,184,255,0.3)",
                  color: "#47b8ff",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                style={{
                  background: "rgba(255,71,71,0.1)",
                  border: "1px solid rgba(255,71,71,0.3)",
                  color: "#ff4747",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-white/60 text-center py-8">No projects yet. Create your first one!</p>
        )}
      </div>
    </div>
  );
}
