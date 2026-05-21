"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { marked } from "marked";
import Footer from "@/components/Footer";

interface Profile {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  image: string | null;
  title: string | null;
  aboutMe: string | null;
  footerAboutMe: string | null;
  social: {
    facebook?: string;
    x?: string;
    instagram?: string;
    upwork?: string;
    linkedin?: string;
    github?: string;
  } | null;
}

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
  readme: string | null;
}

interface ProjectDetailProps {
  project: {
    id: number;
    title: string;
    subtitle: string | null;
    description: string | null;
    coverImage: string | null;
    images: string[] | null;
    technologies: string[] | null;
    githubUrl: string | null;
    liveUrl: string | null;
    readme: string | null;
  };
  userId?: string;
  username?: string;
}

export default function ProjectDetailClient({ project: initialProject, userId, username }: ProjectDetailProps) {
  const [project, setProject] = useState<Project | null>(initialProject);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [githubReadme, setGithubReadme] = useState<string | null>(null);
  const [githubReadmeLoading, setGithubReadmeLoading] = useState(false);

  useEffect(() => {
    if (!initialProject) {
      setError("Project not found");
      setLoading(false);
      return;
    }

    const query = userId ? `?userId=${userId}` : "";
    fetch(`/api/profile${query}`)
      .then((res) => res.json())
      .then((profileData) => {
        setProfile(profileData);
      })
      .catch((err) => console.error("Failed to load profile:", err));

    // Set initial selected image to coverImage or first additional image
    if (initialProject.coverImage) {
      setSelectedImage(initialProject.coverImage);
    } else if (initialProject.images && initialProject.images.length > 0) {
      setSelectedImage(initialProject.images[0]);
    }
    // Fetch README from GitHub if githubUrl exists
    if (initialProject.githubUrl) {
      fetchGithubReadme(initialProject.githubUrl);
    }
  }, [userId, initialProject]);

  const fetchGithubReadme = async (githubUrl: string) => {
    // Extract owner/repo from GitHub URL
    // Supports: https://github.com/owner/repo, https://github.com/owner/repo.git
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/);
    if (!match) return;

    const [, owner, repo] = match;
    setGithubReadmeLoading(true);

    try {
      // Try main branch first, then master
      const urls = [
        `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`,
        `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`,
      ];

      let response: Response | null = null;
      for (const url of urls) {
        response = await fetch(url);
        if (response.ok) break;
      }

      if (response && response.ok) {
        const text = await response.text();
        const html = await marked(text);
        setGithubReadme(html);
      }
    } catch (err) {
      console.error("Failed to fetch GitHub README:", err);
    } finally {
      setGithubReadmeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: "#47b8ff" }} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-3xl font-bold" style={{ color: "#f8fbff" }}>Project Not Found</h1>
        <p style={{ color: "#b0c4de" }}>{error || "The project you're looking for doesn't exist."}</p>
        <Link href={`/${username || ""}`} className="px-6 py-2 rounded-lg no-underline" style={{ backgroundColor: "#47b8ff", color: "#0b2341" }}>
          Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0e1726" }}>
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Project Header Card */}
        <div
          className="rounded-xl p-6 md:p-8 mb-8"
          style={{
            background: "linear-gradient(135deg, rgba(11,35,65,0.8) 0%, rgba(8,17,30,0.9) 100%)",
            border: "1px solid rgba(71,184,255,0.15)",
          }}
        >
          <nav className="mb-3">
            <Link
              href={`/${username || ""}/projects`}
              className="inline-flex items-center gap-1.5 text-sm no-underline transition-colors hover:opacity-80"
              style={{ color: "#47b8ff" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </Link>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#f8fbff" }}>{project.title}</h1>
          {project.subtitle && (
            <p className="text-lg" style={{ color: "#b0c4de" }}>{project.subtitle}</p>
          )}
        </div>

        {/* Image Gallery */}
        {(project.coverImage || (project.images && project.images.length > 0)) && (
          <div className="mb-8">
            {/* Main Image */}
            {selectedImage && (
              <div
                className="relative w-full rounded-xl overflow-hidden mb-4 cursor-pointer group"
                style={{ maxHeight: "500px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
                onClick={() => setLightboxImage(selectedImage)}
              >
                <img
                  src={selectedImage}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ maxHeight: "500px" }}
                />
                {/* Zoom hint overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                  <div
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: "rgba(11,35,65,0.8)", color: "#f8fbff" }}
                  >
                    <svg className="w-5 h-5 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    Click to enlarge
                  </div>
                </div>
              </div>
            )}

            {/* Thumbnail Strip */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {project.coverImage && (
                <button
                  onClick={() => setSelectedImage(project.coverImage!)}
                  className="flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none"
                  style={{
                    borderColor: selectedImage === project.coverImage ? "#47b8ff" : "transparent",
                    opacity: selectedImage === project.coverImage ? 1 : 0.55,
                    filter: selectedImage === project.coverImage ? "none" : "grayscale(0.5)",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedImage !== project.coverImage) {
                      e.currentTarget.style.opacity = "0.8";
                      e.currentTarget.style.filter = "none";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedImage !== project.coverImage) {
                      e.currentTarget.style.opacity = "0.55";
                      e.currentTarget.style.filter = "grayscale(0.5)";
                    }
                  }}
                >
                  <img src={project.coverImage} alt="Cover" className="w-20 h-20 object-cover" />
                </button>
              )}
              {project.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className="flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none"
                  style={{
                    borderColor: selectedImage === img ? "#47b8ff" : "transparent",
                    opacity: selectedImage === img ? 1 : 0.55,
                    filter: selectedImage === img ? "none" : "grayscale(0.5)",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedImage !== img) {
                      e.currentTarget.style.opacity = "0.8";
                      e.currentTarget.style.filter = "none";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedImage !== img) {
                      e.currentTarget.style.opacity = "0.55";
                      e.currentTarget.style.filter = "grayscale(0.5)";
                    }
                  }}
                >
                  <img src={img} alt={`${project.title} ${i + 1}`} className="w-20 h-20 object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lightbox */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm cursor-pointer"
            onClick={() => setLightboxImage(null)}
          >
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <img
                src={lightboxImage}
                alt="Enlarged view"
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                style={{ boxShadow: "0 0 60px rgba(71,184,255,0.15)" }}
              />
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer hover:scale-110"
                style={{ backgroundColor: "rgba(11,35,65,0.9)", border: "1px solid rgba(71,184,255,0.3)" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Project Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description / README */}
          <div className="lg:col-span-2 space-y-8">
            {/* Show "About This Project" only when README is NOT loaded */}
            {!githubReadme && project.description && (
              <div
                className="rounded-xl p-6 md:p-8"
                style={{
                  background: "linear-gradient(180deg, rgba(11,35,65,0.5) 0%, rgba(8,17,30,0.4) 100%)",
                  border: "1px solid rgba(71,184,255,0.12)",
                }}
              >
                <h2 className="text-xl font-semibold mb-4 section-heading">About This Project</h2>
                <div
                  className="leading-relaxed"
                  style={{ color: "#b0c4de", fontSize: "1rem", lineHeight: "1.8" }}
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </div>
            )}

            {/* GitHub README */}
            {githubReadmeLoading && (
              <div
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{
                  backgroundColor: "rgba(11,35,65,0.4)",
                  border: "1px solid rgba(71,184,255,0.12)",
                  color: "#b0c4de",
                }}
              >
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2" style={{ borderColor: "#47b8ff" }} />
                <span className="text-sm">Loading README from GitHub...</span>
              </div>
            )}
            {githubReadme && (
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(180deg, rgba(11,35,65,0.5) 0%, rgba(8,17,30,0.4) 100%)",
                  border: "1px solid rgba(71,184,255,0.12)",
                }}
              >
                <div
                  className="px-6 py-8 readme-content"
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: "1.75",
                  }}
                  dangerouslySetInnerHTML={{ __html: githubReadme }}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div
                className="rounded-xl p-5"
                style={{
                  background: "linear-gradient(180deg, rgba(11,35,65,0.5) 0%, rgba(8,17,30,0.4) 100%)",
                  border: "1px solid rgba(71,184,255,0.12)",
                }}
              >
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: "#f8fbff" }}>
                  <svg className="w-4 h-4" style={{ color: "#47b8ff" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                      style={{
                        backgroundColor: "rgba(71, 184, 255, 0.1)",
                        color: "#47b8ff",
                        border: "1px solid rgba(71, 184, 255, 0.2)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div
              className="rounded-xl p-5"
              style={{
                background: "linear-gradient(180deg, rgba(11,35,65,0.5) 0%, rgba(8,17,30,0.4) 100%)",
                border: "1px solid rgba(71,184,255,0.12)",
              }}
            >
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: "#f8fbff" }}>
                <svg className="w-4 h-4" style={{ color: "#47b8ff" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Links
              </h3>
              <div className="flex flex-col gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg no-underline transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      backgroundColor: "rgba(71, 184, 255, 0.08)",
                      color: "#47b8ff",
                      border: "1px solid rgba(71, 184, 255, 0.2)",
                    }}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    <span className="flex-1">View on GitHub</span>
                    <svg className="w-4 h-4 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg no-underline transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      backgroundColor: "#47b8ff",
                      color: "#0b2341",
                    }}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    <span className="flex-1 font-medium">Live Demo</span>
                    <svg className="w-4 h-4 flex-shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer
        email={profile?.email || undefined}
        phone={profile?.phone || undefined}
        location={profile?.location || undefined}
        aboutText={profile?.footerAboutMe || undefined}
        social={profile?.social || undefined}
      />
    </div>
  );
}
