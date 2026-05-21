"use client";

import { useState, useEffect } from "react";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/admin/profile");
      const data = await res.json();
      if (data) {
        setProfile(data);
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
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
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
    try {
      const res = await fetch("/api/admin/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
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

          <div>
            <label className="block text-white/80 text-sm mb-1">About Me (HTML)</label>
            <textarea rows={6} value={profile.aboutMe} onChange={(e) => handleChange("aboutMe", e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-2 resize-none font-mono text-xs"
              style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)" }} />
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

          <div>
            <label className="block text-white/80 text-sm mb-1">Profile Image URL</label>
            <input type="text" value={profile.image} onChange={(e) => handleChange("image", e.target.value)}
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
          </div>
        </div>
      </div>
    </div>
  );
}
