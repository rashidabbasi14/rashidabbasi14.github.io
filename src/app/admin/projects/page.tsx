"use client";

import { useState, useEffect, useRef } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import Modal from "@/components/Modal";

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
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

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

  // ─── Image Upload Helpers ──────────────────────────────────────────────────

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      console.error("Upload failed");
      return null;
    }
    const data = await res.json();
    return data.url;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const url = await uploadFile(file);
    if (url) {
      setEditingProject((prev) => ({ ...prev, coverImage: url }));
    }
    setUploadingCover(false);
    if (coverFileInputRef.current) coverFileInputRef.current.value = "";
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    const currentImages = editingProject?.images || [];
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i]);
      if (url) newImages.push(url);
    }

    setEditingProject((prev) => ({
      ...prev,
      images: [...currentImages, ...newImages],
    }));
    setUploadingImage(false);
    if (imageFileInputRef.current) imageFileInputRef.current.value = "";
  };

  const removeCoverImage = () => {
    setEditingProject((prev) => ({ ...prev, coverImage: null }));
  };

  const removeAdditionalImage = (index: number) => {
    const currentImages = editingProject?.images || [];
    const updated = currentImages.filter((_, i) => i !== index);
    setEditingProject((prev) => ({ ...prev, images: updated.length > 0 ? updated : null }));
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const currentImages = editingProject?.images || [];
    if (currentImages.length < 2) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentImages.length) return;

    const updated = [...currentImages];
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    setEditingProject((prev) => ({ ...prev, images: updated }));
  };

  const addImageUrl = () => {
    const url = prompt("Enter image URL:");
    if (!url || !url.trim()) return;
    const currentImages = editingProject?.images || [];
    setEditingProject((prev) => ({
      ...prev,
      images: [...currentImages, url.trim()],
    }));
  };

  const openCreate = () => {
    setIsCreating(true);
    setEditingProject({ title: "", technologies: [] });
  };

  const openEdit = (project: Project) => {
    setIsCreating(false);
    setEditingProject(project);
  };

  const closeModal = () => {
    setEditingProject(null);
    setIsCreating(false);
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
          onClick={openCreate}
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

      {/* Edit/Create Modal */}
      <Modal
        isOpen={!!editingProject}
        onClose={closeModal}
        title={isCreating ? "Create Project" : "Edit Project"}
        image={editingProject?.coverImage}
        imageShape="cover"
      >
        <div className="space-y-4">
          {/* Cover Image Controls (inside modal body, below the preview) */}
          <div>
            <label className="block text-white/80 text-sm mb-1">Cover Image URL</label>
            <div className="flex flex-wrap gap-2 items-start">
              <input
                type="text"
                value={editingProject?.coverImage || ""}
                onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                placeholder="Paste image URL or upload below"
                className="flex-1 min-w-[200px] px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
              />
              <input
                ref={coverFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
              <button
                onClick={() => coverFileInputRef.current?.click()}
                disabled={uploadingCover}
                className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                style={{
                  background: "rgba(71,184,255,0.1)",
                  border: "1px solid rgba(71,184,255,0.3)",
                  color: "#47b8ff",
                }}
              >
                {uploadingCover ? "Uploading..." : "Upload"}
              </button>
              {editingProject?.coverImage && (
                <button
                  onClick={removeCoverImage}
                  className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap"
                  style={{
                    background: "rgba(255,71,71,0.1)",
                    border: "1px solid rgba(255,71,71,0.3)",
                    color: "#ff4747",
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Title & Subtitle */}
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

          {/* Description */}
          <div>
            <label className="block text-white/80 text-sm mb-1">Description <span className="text-white/40 text-xs">(HTML supported)</span></label>
            <RichTextEditor
              value={editingProject?.description || ""}
              onChange={(value) => setEditingProject({ ...editingProject, description: value })}
              rows={10}
              placeholder="Describe the project... HTML tags like <b>, <i>, <ul> are supported"
            />
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-white/80 text-sm mb-1">
              Additional Images
              <span className="text-white/40 text-xs ml-1">({editingProject?.images?.length || 0})</span>
            </label>

            {editingProject?.images && editingProject.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
                {editingProject.images.map((img, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border border-white/10">
                    <img
                      src={img}
                      alt={`Image ${index + 1}`}
                      className="w-full h-24 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='M21 15l-5-5L5 21'/%3E%3C/svg%3E"; }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      {index > 0 && (
                        <button
                          onClick={() => moveImage(index, "up")}
                          className="p-1 rounded bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                          title="Move left"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      )}
                      {editingProject.images && index < editingProject.images.length - 1 && (
                        <button
                          onClick={() => moveImage(index, "down")}
                          className="p-1 rounded bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                          title="Move right"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => removeAdditionalImage(index)}
                        className="p-1 rounded bg-red-500/70 hover:bg-red-500 text-white transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <input
                ref={imageFileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => imageFileInputRef.current?.click()}
                disabled={uploadingImage}
                className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer disabled:opacity-50"
                style={{
                  background: "rgba(71,184,255,0.1)",
                  border: "1px solid rgba(71,184,255,0.3)",
                  color: "#47b8ff",
                }}
              >
                {uploadingImage ? "Uploading..." : "Upload Images"}
              </button>
              <button
                onClick={addImageUrl}
                className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
                style={{
                  background: "rgba(71,184,255,0.1)",
                  border: "1px solid rgba(71,184,255,0.3)",
                  color: "#47b8ff",
                }}
              >
                + Add URL
              </button>
            </div>
          </div>

          {/* Technologies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* URLs */}
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

          {/* Priority */}
          <label className="flex items-center gap-2 text-white/80 text-sm">
            <input
              type="checkbox"
              checked={editingProject?.priority || false}
              onChange={(e) => setEditingProject({ ...editingProject, priority: e.target.checked })}
              className="rounded accent-[#47b8ff]"
            />
            Priority (show first)
          </label>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
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
              onClick={closeModal}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Projects List */}
      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="portfolio-card p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                {project.coverImage && (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
                <div>
                  <h3 className="text-white font-semibold text-sm">{project.title}</h3>
                  {project.subtitle && (
                    <p className="text-white/60 text-xs mt-0.5">{project.subtitle}</p>
                  )}
                </div>
              </div>
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="tag-badge text-[10px]">{tech}</span>
                  ))}
                </div>
              )}
              {project.images && project.images.length > 0 && (
                <p className="text-white/40 text-[10px] mt-1">
                  {project.images.length} additional image{project.images.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <button
                onClick={() => openEdit(project)}
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
