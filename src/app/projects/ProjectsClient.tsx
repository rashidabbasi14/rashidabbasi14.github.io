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

interface ProjectsClientProps {
  projects?: Array<{
    id: number;
    title: string;
    subtitle: string | null;
    description: string | null;
    coverImage: string | null;
    technologies: string[] | null;
    priority: boolean;
  }>;
  userId?: string;
  username?: string;
}

export default function ProjectsClient({ projects: initialProjects, userId, username }: ProjectsClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(!initialProjects);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [tagSearch, setTagSearch] = useState("");

  useEffect(() => {
    const query = userId ? `?userId=${userId}` : "";
    Promise.all([
      initialProjects ? Promise.resolve(initialProjects) : fetch(`/api/projects${query}`).then((res) => res.json()),
      fetch(`/api/profile${query}`).then((res) => res.json()),
    ])
      .then(([projectsData, profileData]) => {
        const sorted = (projectsData as Project[]).sort((a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0));
        if (!initialProjects) setProjects(sorted);
        setProjects(sorted);
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
      <div className="flex-1 flex items-center justify-center min-h-screen" role="status" aria-label="Loading projects">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: "#47b8ff" }} />
        <span className="sr-only">Loading projects...</span>
      </div>
    );
  }

  return (
    <>

      <main className="flex-1">
        <section className="py-8" aria-label="Projects listing">
          <div className="container mx-auto px-4">
            {/* Page Header */}
            <div
              className="rounded-xl p-6 md:p-8 mb-8"
              style={{
                background: "linear-gradient(135deg, rgba(11,35,65,0.8) 0%, rgba(8,17,30,0.9) 100%)",
                border: "1px solid rgba(71,184,255,0.15)",
              }}
            >
              <h1 className="text-3xl md:text-4xl font-bold" style={{ color: "#f8fbff" }}>Projects</h1>
              <p className="mt-2" style={{ color: "#c8d6e5" }}>
                {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
                {selectedTags.size > 0 && ` filtered by ${selectedTags.size} tag${selectedTags.size > 1 ? "s" : ""}`}
              </p>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-2 mb-6">
              <div className="flex-1">
                <label htmlFor="project-search" className="sr-only">Search projects</label>
                <input
                  id="project-search"
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
                  autoComplete="off"
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
                  aria-expanded={false}
                  aria-controls="filterDropdown"
                  aria-label="Filter projects by technology"
                >
                  <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters {selectedTags.size > 0 && `(${selectedTags.size})`}
                  <svg className="inline-block w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                  role="dialog"
                  aria-label="Filter by technology"
                >
                  <div className="p-3">
                    <label htmlFor="tag-search" className="sr-only">Search technologies</label>
                    <input
                      id="tag-search"
                      type="text"
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                      placeholder="Search technologies..."
                      className="w-full px-3 py-1.5 text-sm rounded-lg text-white placeholder-white/40 mb-2 focus:outline-none"
                      style={{
                        backgroundColor: "rgba(11,35,65,0.6)",
                        border: "1px solid rgba(71,184,255,0.15)",
                      }}
                      autoComplete="off"
                    />
                    <div className="max-h-48 overflow-y-auto space-y-1" role="group" aria-label="Technology filters">
                      {filteredTechnologies.map((tech) => (
                        <label
                          key={tech}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-white/5 text-sm text-[#c8d6e5]"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Projects">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/${username ? username + "/" : ""}project/${project.id}`}
                  className="portfolio-card flex flex-col text-decoration-none text-reset"
                  role="listitem"
                  aria-label={`View project: ${project.title}`}
                >
                  {project.coverImage && (
                    <div className="relative overflow-hidden">
                      <img
                        src={project.coverImage}
                        alt={`${project.title} cover image`}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {project.priority && (
                        <span
                          className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                          style={{ backgroundColor: "rgba(71,184,255,0.2)", color: "#47b8ff", border: "1px solid rgba(71,184,255,0.3)" }}
                        >
                          Featured
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-white font-semibold text-base mb-1">{project.title}</h3>
                    {project.subtitle && (
                      <p className="text-[#c8d6e5] text-sm mb-2">{project.subtitle}</p>
                    )}
                    {project.description && (
                      <p className="text-[#c8d6e5] text-sm flex-1 line-clamp-3" dangerouslySetInnerHTML={{ __html: project.description }} />
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4 pt-3" style={{ borderTop: "1px solid rgba(71,184,255,0.1)" }}>
                        {project.technologies.slice(0, 4).map((tech, i) => (
                          <span key={i} className="tag-badge text-[11px]">{tech}</span>
                        ))}
                        {project.technologies.length > 4 && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(71,184,255,0.05)", color: "rgba(71,184,255,0.6)" }}>
                            +{project.technologies.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-16" role="status">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#47b8ff" }} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-white/50 text-lg">No projects found matching your criteria.</p>
                {selectedTags.size > 0 && (
                  <button
                    onClick={() => setSelectedTags(new Set())}
                    className="mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    style={{ backgroundColor: "rgba(71,184,255,0.1)", color: "#47b8ff", border: "1px solid rgba(71,184,255,0.2)" }}
                  >
                    Clear filters
                  </button>
                )}
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
