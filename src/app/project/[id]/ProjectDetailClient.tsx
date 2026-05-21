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

export default function ProjectDetailClient({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [githubReadme, setGithubReadme] = useState<string | null>(null);
  const [githubReadmeLoading, setGithubReadmeLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/projects/${projectId}`).then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error("Project not found");
          throw new Error("Failed to load project");
        }
        return res.json();
      }),
      fetch("/api/profile").then((res) => res.json()),
    ])
      .then(([projectData, profileData]) => {
        setProject(projectData);
        setProfile(profileData);
        // Set initial selected image to coverImage or first additional image
        if (projectData.coverImage) {
          setSelectedImage(projectData.coverImage);
        } else if (projectData.images && projectData.images.length > 0) {
          setSelectedImage(projectData.images[0]);
        }
        // Fetch README from GitHub if githubUrl exists
        if (projectData.githubUrl) {
          fetchGithubReadme(projectData.githubUrl);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectId]);

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
      <>
        <header className="py-5 text-white" style={{ backgroundColor: "#0b2341" }}>
          <div className="container mx-auto px-4">
            <Link href="/projects" className="text-white/70 hover:text-white text-sm">
              &larr; Back to Projects
            </Link>
            <h1 className="text-3xl md:text-4xl font-semibold mt-2">Project Not Found</h1>
          </div>
        </header>
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12 text-center">
            <p className="text-white/60">{error || "The project you're looking for doesn't exist."}</p>
            <Link
              href="/projects"
              className="inline-block mt-4 px-4 py-2 rounded-xl font-medium transition-all duration-200"
              style={{
                background: "rgba(71,184,255,0.1)",
                border: "1px solid rgba(71,184,255,0.3)",
                color: "#47b8ff",
              }}
            >
              View all projects
            </Link>
          </div>
        </main>
        <Footer
          email={profile?.email || undefined}
          phone={profile?.phone || undefined}
          location={profile?.location || undefined}
          aboutText={profile?.footerAboutMe || undefined}
          social={profile?.social || undefined}
        />
      </>
    );
  }

  const readmeHtml = project.readme ? marked(project.readme) : null;

  return (
    <>
      <header className="py-5 text-white" style={{ backgroundColor: "#0b2341" }}>
        <div className="container mx-auto px-4">
          <nav className="mb-2">
            <Link href="/projects" className="text-white/70 hover:text-white text-sm">
              &larr; Projects
            </Link>
            <span className="text-white/50 mx-2">/</span>
            <span className="text-white text-sm">{project.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-semibold">{project.title}</h1>
          {project.subtitle && (
            <p className="text-white/80 mt-2">{project.subtitle}</p>
          )}
        </div>
      </header>

      <main className="flex-1">
        <section className="py-5">
          <div className="container mx-auto px-4">
            {/* Image Gallery */}
            {(() => {
              const allImages: string[] = [];
              if (project.coverImage) allImages.push(project.coverImage);
              if (project.images && project.images.length > 0) {
                project.images.forEach((img) => {
                  if (!allImages.includes(img)) allImages.push(img);
                });
              }

              if (allImages.length === 0) return null;

              return (
                <div className="mb-6">
                  {/* Main Display Image */}
                  <div
                    className="rounded-2xl overflow-hidden mb-4 max-h-[500px] bg-black/40 cursor-pointer"
                    onClick={() => setLightboxImage(selectedImage || allImages[0])}
                  >
                    <img
                      src={selectedImage || allImages[0]}
                      alt={project.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Thumbnail Strip */}
                  {allImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {allImages.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImage(img)}
                          className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                            selectedImage === img
                              ? "border-[#47b8ff] opacity-100"
                              : "border-transparent opacity-60 hover:opacity-90"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${project.title} image ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Project Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* GitHub README (fetched live) — shown if githubUrl exists */}
                {githubReadme && (
                  <div className="portfolio-card p-6 mb-0 readme-content">
                    <div dangerouslySetInnerHTML={{ __html: githubReadme }} />
                  </div>
                )}

                {/* Loading state for GitHub README */}
                {githubReadmeLoading && (
                  <div className="portfolio-card p-6 mb-6 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2" style={{ borderColor: "#47b8ff" }} />
                    <span className="text-white/60 text-sm ml-3">Loading README from GitHub...</span>
                  </div>
                )}

                {/* Fallback: DB description — shown only if no githubUrl OR githubUrl exists but readme failed to load */}
                {!githubReadmeLoading && !githubReadme && project.description && (
                  <div className="portfolio-card p-6 mb-6">
                    <h2 className="text-white font-semibold text-lg mb-3">About This Project</h2>
                    <p className="text-white/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: project.description }} />
                  </div>
                )}

                {/* DB-stored README (legacy) — only shown if no githubUrl */}
                {!project.githubUrl && readmeHtml && (
                  <div
                    className="portfolio-card p-6 readme-content"
                    dangerouslySetInnerHTML={{ __html: readmeHtml }}
                  />
                )}
              </div>

              {/* Sidebar */}
              <div>
                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="portfolio-card p-6 mb-4">
                    <h3 className="text-white font-semibold text-sm mb-3">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="tag-badge">{tech}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                {(project.githubUrl || project.liveUrl) && (
                  <div className="portfolio-card p-6">
                    <h3 className="text-white font-semibold text-sm mb-3">Links</h3>
                    <div className="space-y-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                          style={{
                            background: "rgba(71,184,255,0.1)",
                            border: "1px solid rgba(71,184,255,0.3)",
                            color: "#47b8ff",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(71,184,255,0.2)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(71,184,255,0.1)"; }}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                          </svg>
                          View on GitHub
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                          style={{
                            background: "rgba(71,184,255,0.1)",
                            border: "1px solid rgba(71,184,255,0.3)",
                            color: "#47b8ff",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(71,184,255,0.2)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(71,184,255,0.1)"; }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                          </svg>
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        email={profile?.email || undefined}
        phone={profile?.phone || undefined}
        location={profile?.location || undefined}
        aboutText={profile?.footerAboutMe || undefined}
        social={profile?.social || undefined}
      />

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors cursor-pointer z-10"
            aria-label="Close lightbox"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={lightboxImage}
            alt={project.title}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
