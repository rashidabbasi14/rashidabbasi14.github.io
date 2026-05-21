"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
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
  technologies: string[] | null;
  priority: boolean;
}

export default function ProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [tagSearch, setTagSearch] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((res) => res.json()),
      fetch("/api/profile").then((res) => res.json()),
    ])
      .then(([projectsData, profileData]) => {
        setProjects(projectsData);
        setProfile(profileData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Extract all unique technologies
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((p) => p.technologies?.forEach((t) => techSet.add(t)));
    return Array.from(techSet).sort();
  }, [projects]);

  // Filter technologies by tag search
  const filteredTechnologies = useMemo(() => {
    if (!tagSearch) return allTechnologies;
    return allTechnologies.filter((t) =>
      t.toLowerCase().includes(tagSearch.toLowerCase())
    );
  }, [allTechnologies, tagSearch]);

  // Filter projects by search and selected tags
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.technologies || []).some((t) =>
          t.toLowerCase().includes(search.toLowerCase())
        );

      const matchesTags =
        selectedTags.size === 0 ||
        (p.technologies || []).some((t) => selectedTags.has(t));

      return matchesSearch && matchesTags;
    });
  }, [projects, search, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: "#47b8ff" }} />
      </div>
    );
  }

  return (
    <>
      <header className="py-5 text-white" style={{ backgroundColor: "#0b2341" }}>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-semibold">My Projects</h1>
          <p className="text-white/80 mt-2">Explore my portfolio of software engineering projects</p>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-5">
          <div className="container mx-auto px-4">
            {/* Search & Filter */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects by title, description, or tags..."
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/40 transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "rgba(11,35,65,0.6)",
                    border: "1px solid rgba(71,184,255,0.15)",
                    "--tw-ring-color": "rgba(71,184,255,0.3)",
                  } as React.CSSProperties}
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => {
                    const dropdown = document.getElementById("filterDropdown");
                    if (dropdown) dropdown.classList.toggle("hidden");
                  }}
                  className="px-4 py-2.5 rounded-xl font-medium transition-all duration-200 cursor-pointer whitespace-nowrap"
                  style={{
                    background: "rgba(71,184,255,0.1)",
                    border: "1px solid rgba(71,184,255,0.3)",
                    color: "#47b8ff",
                  }}
                >
                  Filters {selectedTags.size > 0 && `(${selectedTags.size})`}
                  <svg className="inline-block w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                  </svg>
                </button>

                {/* Dropdown */}
                <div
                  id="filterDropdown"
                  className="hidden absolute right-0 mt-2 w-64 rounded-xl shadow-2xl z-20"
                  style={{
                    background: "linear-gradient(180deg, rgba(16,31,60,0.98), rgba(8,17,30,0.98))",
                    border: "1px solid rgba(71,184,255,0.2)",
                  }}
                >
                  <div className="p-3">
                    <input
                      type="text"
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                      placeholder="Search technologies..."
                      className="w-full px-3 py-1.5 text-sm rounded-lg text-white placeholder-white/40 mb-2 focus:outline-none"
                      style={{
                        backgroundColor: "rgba(11,35,65,0.6)",
                        border: "1px solid rgba(71,184,255,0.15)",
                      }}
                    />
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {filteredTechnologies.map((tech) => (
                        <label
                          key={tech}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white/5 text-sm text-white/80"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTags.has(tech)}
                            onChange={() => toggleTag(tech)}
                            className="rounded accent-[#47b8ff]"
                          />
                          {tech}
                        </label>
                      ))}
                      {filteredTechnologies.length === 0 && (
                        <p className="text-white/50 text-sm text-center py-2">No technologies found</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/project/${project.id}`}
                  className="portfolio-card flex flex-col text-decoration-none text-reset"
                >
                  {project.coverImage && (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-56 object-cover"
                    />
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-white font-semibold text-sm mb-1">{project.title}</h3>
                    {project.subtitle && (
                      <p className="text-white/70 text-xs mb-2">{project.subtitle}</p>
                    )}
                    {project.description && (
                      <p className="text-white/70 text-xs flex-1" dangerouslySetInnerHTML={{ __html: project.description }} />
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="tag-badge text-[11px]">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/60">No projects found matching your criteria.</p>
              </div>
            )}
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
    </>
  );
}
