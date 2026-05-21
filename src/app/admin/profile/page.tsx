"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import RichTextEditor from "@/components/RichTextEditor";

interface Profile {
  id: number;
  name: string;
  title: string;
  tagline: string;
  description: string;
  aboutMe: string;
  footerAboutMe: string;
  image: string;
  email: string;
  phone: string | null;
  location: string | null;
  isPrivate?: boolean;
  social: {
    facebook?: string;
    x?: string;
    instagram?: string;
    upwork?: string;
    linkedin?: string;
    github?: string;
  };
}

const defaultSocial = { facebook: "", x: "", instagram: "", upwork: "", linkedin: "", github: "" };

export default function AdminProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crop modal state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/admin/profile");
      const data = await res.json();
      // New response format: { profile, username }
      const profileData = data?.profile ?? data;
      if (profileData && profileData.id) {
        setProfile(profileData);
      } else {
        setProfile({
          id: 0,
          name: "",
          title: "",
          tagline: "",
          description: "",
          aboutMe: "",
          footerAboutMe: "",
          image: "",
          email: "",
          phone: "",
          location: "",
          social: { ...defaultSocial },
        });
      }
      setUsername(data?.username ?? "");
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSocialChange = (field: string, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, social: { ...profile.social, [field]: value } });
  };

  const handleSave = async () => {
    if (!profile?.name || !profile?.email) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, username }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || `Failed to save profile (${res.status})`);
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
      setError("Network error — could not reach server");
    } finally {
      setSaving(false);
    }
  };

  // ─── Image Upload with Crop ────────────────────────────────────────────────

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

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCropImageSrc(dataUrl);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<Blob | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  const handleCropConfirm = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return;

    setUploadingImage(true);
    setCropModalOpen(false);

    try {
      const croppedBlob = await createCroppedImage(cropImageSrc, croppedAreaPixels);
      if (!croppedBlob) {
        console.error("Failed to create cropped image");
        setUploadingImage(false);
        return;
      }

      const file = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        handleChange("image", data.url);
      }
    } catch (err) {
      console.error("Failed to crop and upload image:", err);
    } finally {
      setUploadingImage(false);
      setCropImageSrc(null);
      setCroppedAreaPixels(null);
    }
  };

  const handleCropCancel = () => {
    setCropModalOpen(false);
    setCropImageSrc(null);
    setCroppedAreaPixels(null);
  };

  const removeImage = () => {
    handleChange("image", "");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0e1726" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: "#47b8ff" }} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0e1726" }}>
        <p className="text-white/60">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="portfolio-card p-6">
        <h2 className="text-white font-semibold text-lg mb-6">Profile Information</h2>
        <div className="space-y-4">
          {/* ─── Username ─────────────────────────────────────────────── */}
          <div>
            <label className="block text-white/80 text-sm mb-1">
              Username <span className="text-white/40 text-xs">(your unique portfolio URL)</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-sm whitespace-nowrap">{process.env.NEXT_PUBLIC_SITE_NAME?.toLowerCase() || "portfoliobuilder"}.com/</span>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(null);
                }}
                placeholder="your-username"
                className="flex-1 px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2 font-mono"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
              />
            </div>
            <p className="text-white/40 text-xs mt-1">
              Must be 3-100 characters. Only letters, numbers, hyphens, and underscores.
            </p>
          </div>
          {/* ─── Profile Image — at top ──────────────────────────────────── */}
          <div>
            <label className="block text-white/80 text-sm mb-1">Profile Image</label>

            {/* Preview — shown above the fields, matching home page style */}
            {profile.image && (
              <div className="mb-3 flex flex-col items-center">
                <div
                  className="rounded-full overflow-hidden"
                  style={{
                    width: "170px",
                    height: "170px",
                    boxShadow: "0 0 0 5px rgba(255,255,255,0.12)",
                  }}
                >
                  <img
                    src={profile.image}
                    alt="Profile preview"
                    className="w-full h-full"
                    style={{ objectFit: "cover", objectPosition: "50% 50%" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              </div>
            )}

            {/* Input fields */}
            <div className="flex flex-wrap gap-2 items-start">
              <input
                type="text"
                value={profile.image}
                onChange={(e) => handleChange("image", e.target.value)}
                placeholder="Paste image URL or upload below"
                className="flex-1 min-w-[200px] px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelected}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 whitespace-nowrap"
                style={{
                  background: "rgba(71,184,255,0.1)",
                  border: "1px solid rgba(71,184,255,0.3)",
                  color: "#47b8ff",
                }}
              >
                {uploadingImage ? "Uploading..." : "Upload"}
              </button>
              {profile.image && (
                <button
                  onClick={removeImage}
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

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-1">Name *</label>
              <input type="text" value={profile.name} onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Title</label>
              <input type="text" value={profile.title} onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Tagline</label>
            <input type="text" value={profile.tagline} onChange={(e) => handleChange("tagline", e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Description</label>
            <textarea rows={3} value={profile.description} onChange={(e) => handleChange("description", e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2 resize-none"
              style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
          </div>

          {/* About Me — Rich Text Editor */}
          <div>
            <label className="block text-white/80 text-sm mb-1">About Me <span className="text-white/40 text-xs">(HTML supported)</span></label>
            <RichTextEditor
              value={profile.aboutMe}
              onChange={(value) => handleChange("aboutMe", value)}
              rows={10}
              placeholder="Write about yourself... HTML tags like <b>, <i>, <ul> are supported"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Footer About Me</label>
            <textarea rows={3} value={profile.footerAboutMe} onChange={(e) => handleChange("footerAboutMe", e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2 resize-none"
              style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
          </div>

          {/* Contact Info */}
          <h3 className="text-white font-semibold text-md pt-4 border-t border-white/10">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-1">Email *</label>
              <input type="email" value={profile.email} onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Phone</label>
              <input type="text" value={profile.phone || ""} onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Location</label>
            <input type="text" value={profile.location || ""} onChange={(e) => handleChange("location", e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
          </div>

          {/* Social Links */}
          <h3 className="text-white font-semibold text-md pt-4 border-t border-white/10">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(defaultSocial).map(([key]) => (
              <div key={key}>
                <label className="block text-white/80 text-sm mb-1 capitalize">{key}</label>
                <input
                  type="text"
                  value={(profile.social as any)[key] || ""}
                  onChange={(e) => handleSocialChange(key, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }}
                />
              </div>
            ))}
          </div>

          {/* ─── Privacy Toggle ──────────────────────────────────────────── */}
          <div className="pt-4 border-t border-white/10">
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                role="switch"
                aria-checked={!!profile.isPrivate}
                onClick={() => handleChange("isPrivate", !profile.isPrivate)}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200"
                style={{
                  backgroundColor: profile.isPrivate ? "#47b8ff" : "rgba(255,255,255,0.15)",
                }}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                  style={{ transform: profile.isPrivate ? "translateX(1.375rem)" : "translateX(0.25rem)" }}
                />
              </button>
              <div className="flex flex-col">
                <span className="text-white/80 text-sm font-medium">Private Portfolio</span>
                <span className="text-white/40 text-xs">
                  When enabled, your portfolio won't appear in the landing page and only you can view it.
                </span>
              </div>
            </label>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={saving || !profile.name || !profile.email}
              className="px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50"
              style={{ background: "rgba(71,184,255,0.1)", border: "1px solid rgba(71,184,255,0.3)", color: "#47b8ff" }}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
            {saved && <span className="text-green-400 text-sm">✓ Saved successfully</span>}
            {error && <span className="text-red-400 text-sm">{error}</span>}
          </div>
        </div>
      </div>

      {/* ─── Crop Modal ──────────────────────────────────────────────────── */}
      {cropModalOpen && cropImageSrc && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85"
          onClick={handleCropCancel}
        >
          <div
            className="relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden"
            style={{ backgroundColor: "#0e1726", border: "1px solid rgba(71,184,255,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <h3 className="text-white font-semibold text-sm">Crop & Zoom Image</h3>
              <button
                onClick={handleCropCancel}
                className="text-white/60 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cropper */}
            <div className="relative w-full" style={{ height: "400px" }}>
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: { backgroundColor: "#0a1628" },
                }}
              />
            </div>

            {/* Zoom slider */}
            <div className="px-5 py-3 border-t border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-white/60 text-xs">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-[#47b8ff] cursor-pointer"
                  style={{ height: "4px" }}
                />
                <span className="text-white/60 text-xs w-8 text-right">{zoom.toFixed(1)}x</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 px-5 py-3 border-t border-white/10">
              <button
                onClick={handleCropCancel}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
                style={{
                  background: "rgba(71,184,255,0.1)",
                  border: "1px solid rgba(71,184,255,0.3)",
                  color: "#47b8ff",
                }}
              >
                Apply & Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
