"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import AutoScrollCarousel from "@/components/AutoScrollCarousel";

interface Profile {
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

interface Education {
  id: number;
  degree: string;
  institution: string;
  year: string;
}

interface SkillCategory {
  id: number;
  name: string;
  items: { id: number; name: string; image: string }[];
}

interface Employment {
  id: number;
  title: string;
  company: string;
  duration: string | null;
  description: string | null;
  image: string | null;
  isCurrent: boolean;
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

interface Certification {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  url: string | null;
  tags: string[] | null;
}

export default function HomeClient({ userId, username }: { userId?: string; username?: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [employment, setEmployment] = useState<Employment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showAllEmployment, setShowAllEmployment] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const query = userId ? `?userId=${userId}` : "";
        const [profileRes, eduRes, skillsRes, empRes, projRes, certRes] = await Promise.all([
          fetch(`/api/profile${query}`),
          fetch(`/api/education${query}`),
          fetch(`/api/skills${query}`),
          fetch(`/api/employment${query}`),
          fetch(`/api/projects${query}`),
          fetch(`/api/certifications${query}`),
        ]);

        setProfile(await profileRes.json());
        setEducation(await eduRes.json());
        setSkillCategories(await skillsRes.json());
        setEmployment(await empRes.json());
        setProjects(await projRes.json());
        setCertifications(await certRes.json());
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  // Scroll to hash after data loads (e.g., navigating from another page to /#contact)
  useEffect(() => {
    if (!loading && typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        // Small delay to ensure DOM is fully rendered
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen" role="status" aria-label="Loading portfolio">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: "#47b8ff" }} />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  const phoneDigits = profile?.phone?.replace(/\D/g, "") || "";

  return (
    <>
      {/* Skip to content link */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Hero Section */}
      <header
        id="main-content"
        className="py-5 flex items-center min-h-[60vh]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(11, 35, 65, 0.85), rgba(5, 14, 30, 0.92)), url('/uploads/background.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-label="Portfolio hero section"
      >
        <div className="container mx-auto px-4 text-center">
          {profile?.image && (
            <Image
              src={profile.image.startsWith("http") ? profile.image : `/${profile.image.replace(/^\/+/, "")}`}
              alt={`Portrait of ${profile?.name || "portfolio owner"}`}
              width={170}
              height={170}
              className="rounded-full mx-auto mb-4"
              style={{ boxShadow: "0 0 0 5px rgba(255,255,255,0.12)", objectFit: "cover", width: "170px", height: "170px" }}
              priority
            />
          )}
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3">
            {profile?.tagline || "Full-Stack Software Engineer"}
          </h1>
          <p
            className="text-lg text-[#c8d6e5] mx-auto mb-4"
            style={{ maxWidth: "680px" }}
          >
            {profile?.description}
          </p>

          {/* Hero Links */}
          {profile?.social && (
            <div className="flex flex-wrap justify-center gap-2 max-w-[900px] mx-auto" role="list" aria-label="Social media links">
              <HeroLink href={profile.social.facebook} icon={<FacebookIcon />} label="Facebook" />
              <HeroLink href={profile.social.x} icon={<XIcon />} label="X (Twitter)" />
              <HeroLink href={profile.social.instagram} icon={<InstagramIcon />} label="Instagram" />
              <span className="hidden md:block w-px bg-white/40 mx-1" aria-hidden="true" />
              <HeroLink href={profile.social.upwork} icon={<UpworkIcon />} label="Upwork" />
              <HeroLink href={profile.social.linkedin} icon={<LinkedInIcon />} label="LinkedIn" />
              <HeroLink href={profile.social.github} icon={<GitHubIcon />} label="GitHub" />
            </div>
          )}

          {/* Skills */}
          {skillCategories.length > 0 && (
            <div className="mt-6 text-left max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-[#e8eef5] font-semibold">Skills & Technologies</h5>
                {skillCategories.length > 3 && (
                  <button
                    onClick={() => setShowAllSkills(!showAllSkills)}
                    className="text-sm px-3 py-1.5 rounded-xl font-medium transition-all duration-200 cursor-pointer"
                    style={{
                      background: "rgba(71,184,255,0.1)",
                      border: "1px solid rgba(71,184,255,0.3)",
                      color: "#47b8ff",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(71,184,255,0.2)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(71,184,255,0.1)"; }}
                    aria-expanded={showAllSkills}
                    aria-controls="skills-list"
                  >
                    {showAllSkills ? "Show less" : `All Skills (${skillCategories.length})`}
                    <svg className={`inline-block w-3 h-3 ml-1 transition-transform ${showAllSkills ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                  </button>
                )}
              </div>
              <div id="skills-list">
                {(showAllSkills ? skillCategories : skillCategories.slice(0, 3)).map((cat) => (
                  <div key={cat.id} className="skill-section">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                      <h6 className="text-white font-bold text-sm md:w-[120px] flex-shrink-0">{cat.name}</h6>
                      <div className="flex flex-wrap gap-3">
                        {cat.items.map((skill) => (
                          <div key={skill.id} className="flex flex-col items-center" style={{ minWidth: "50px", maxWidth: "65px" }}>
                            <img
                              src={skill.image}
                              alt={skill.name}
                              className="w-[45px] h-[45px] object-cover rounded-full"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = "none";
                                const fallback = document.createElement("div");
                                fallback.className = "flex items-center justify-center rounded-full text-xs font-bold";
                                fallback.style.cssText = "width:45px;height:45px;background:rgba(71,184,255,0.2);color:#47b8ff;";
                                fallback.textContent = skill.name.substring(0, 2).toUpperCase();
                                target.parentElement?.insertBefore(fallback, target);
                              }}
                            />
                            <span className="text-[11px] text-[#c8d6e5] mt-1 text-center leading-tight">{skill.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* About & Education */}
        <section className="py-5" aria-label="About and education">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <h2 className="section-heading">About Me</h2>
                <div className="portfolio-card p-6">
                  <div className="text-[#c8d6e5] leading-relaxed" dangerouslySetInnerHTML={{ __html: profile?.aboutMe || "" }} />
                </div>
              </div>
              <div>
                <h2 className="section-heading">Education</h2>
                <div className="portfolio-card p-6">
                  {education.map((edu, i) => (
                    <div key={edu.id} className={i > 0 ? "timeline-item mt-3 pt-3 border-t border-white/10" : "timeline-item"}>
                      <div className="timeline-date">Graduated {edu.year}</div>
                      <strong className="text-white">{edu.degree}</strong>
                      <p className="text-[#c8d6e5] text-sm mb-0">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Employment */}
        <section id="employment" className="py-5" aria-label="Employment history">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-heading mb-0">Employment History</h2>
              {employment.length > 1 && (
                <button
                  onClick={() => setShowAllEmployment(!showAllEmployment)}
                  className="text-sm px-3 py-1.5 rounded-xl font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    background: "rgba(71,184,255,0.1)",
                    border: "1px solid rgba(71,184,255,0.3)",
                    color: "#47b8ff",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(71,184,255,0.2)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(71,184,255,0.1)"; }}
                  aria-expanded={showAllEmployment}
                  aria-controls="employment-list"
                >
                  {showAllEmployment ? "Hide roles" : "All roles"}
                </button>
              )}
            </div>

            <div id="employment-list">
              {employment.length > 0 && (
                <>
                  <EmploymentCard item={employment[0]} size={72} />
                  {showAllEmployment && employment.slice(1).map((item) => (
                    <EmploymentCard key={item.id} item={item} size={56} />
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Projects - Auto-scrolling Carousel */}
        <AutoScrollCarousel
          title="Key Projects"
          viewAllHref="/projects"
          viewAllLabel="View all"
          speed={35}
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} username={username} />
          ))}
        </AutoScrollCarousel>

        {/* Certifications - Auto-scrolling Carousel */}
        <AutoScrollCarousel
          title="Certifications"
          speed={30}
        >
          {certifications.map((cert) => (
            <CertCard key={cert.id} cert={cert} />
          ))}
        </AutoScrollCarousel>

        {/* Contact Section */}
        <section id="contact" className="py-5" aria-label="Contact">
          <div className="container mx-auto px-4 text-center">
            <h2 className="section-heading">Schedule a Quick Meeting and Get a FREE Quote!</h2>
            <p className="text-[#c8d6e5] mb-6 max-w-xl mx-auto">
              Have a project in mind or just want to say hello? Feel free to reach out!
            </p>
            <button
              onClick={() => setContactOpen(true)}
              className="px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: "transparent",
                border: "2px solid #47b8ff",
                color: "#47b8ff",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(71,184,255,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              aria-label="Send a message via contact form"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Send a Message
              </span>
            </button>
          </div>
        </section>
      </main>

      <Footer
        email={profile?.email}
        phone={profile?.phone || undefined}
        location={profile?.location || undefined}
        aboutText={profile?.footerAboutMe}
        social={profile?.social}
        onContactClick={() => setContactOpen(true)}
        username={username}
      />

      {/* Contact Modal */}
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} email={profile?.email} />

      {/* WhatsApp Float */}
      {phoneDigits && (
        <a
          href={`https://wa.me/${phoneDigits}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-float"
          aria-label="Chat on WhatsApp"
        >
          <span className="whatsapp-tooltip">Chat on WhatsApp</span>
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function HeroLink({ href, icon, label }: { href?: string; icon: React.ReactNode; label: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 min-w-[110px] px-3 py-1.5 text-sm rounded-lg text-[#c8d6e5] border border-white/40 hover:bg-white/10 transition-all duration-200"
      aria-label={`Visit ${label || "social profile"}`}
      role="listitem"
    >
      <span className="w-4 h-4 shrink-0" aria-hidden="true">{icon}</span>
      {label && <span>{label}</span>}
    </a>
  );
}

function EmploymentCard({ item, size }: { item: Employment; size: number }) {
  const getInitials = (text: string) =>
    text.split(/\s+/).map((w) => w[0] || "").join("").slice(0, 2).toUpperCase();

  return (
    <div className="portfolio-card p-4 mb-3" role="article" aria-label={`${item.title} at ${item.company}`}>
      <div className="flex items-start gap-3">
        {item.image ? (
          <img
            src={item.image}
            alt={`${item.company} logo`}
            className="rounded-full object-cover flex-shrink-0"
            style={{ width: size, height: size }}
            loading="lazy"
          />
        ) : (
          <div
            className="rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0"
            style={{
              width: size,
              height: size,
              backgroundColor: "#0d6efd",
              fontSize: Math.max(14, Math.floor(size / 3)),
            }}
            aria-hidden="true"
          >
            {getInitials(item.company)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm">{item.title}</h3>
          <p className="text-[#c8d6e5] text-xs">
            {item.company}{item.duration ? ` | ${item.duration}` : ""}
          </p>
          {item.description && (
            <p className="text-[#c8d6e5] text-xs mt-2">{item.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, username }: { project: Project; username?: string }) {
  const basePath = username ? `/${username}` : "";
  return (
    <Link href={`${basePath}/project/${project.id}`} className="portfolio-card flex flex-col text-decoration-none text-reset" aria-label={`View project: ${project.title}`}>
      {project.coverImage && (
        <img
          src={project.coverImage}
          alt={`${project.title} cover image`}
          className="w-full h-56 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-sm mb-1">{project.title}</h3>
        {project.subtitle && (
          <p className="text-[#c8d6e5] text-xs mb-2">{project.subtitle}</p>
        )}
        {project.description && (
          <p className="text-[#c8d6e5] text-xs flex-1" dangerouslySetInnerHTML={{ __html: project.description }} />
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
  );
}

function CertCard({ cert }: { cert: Certification }) {
  const content = (
    <div className="portfolio-card flex flex-col h-full">
      {cert.image && (
        <img
          src={cert.image}
          alt={`${cert.title} certificate`}
          className="w-full h-56 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-sm">{cert.title}</h3>
        {cert.subtitle && <p className="text-[#c8d6e5] text-xs">{cert.subtitle}</p>}
        {cert.description && <p className="text-[#c8d6e5] text-xs mt-1" dangerouslySetInnerHTML={{ __html: cert.description }} />}
        {cert.tags && cert.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {cert.tags.map((tag, i) => (
              <span key={i} className="tag-badge text-[11px]">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (cert.url) {
    return (
      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="block" aria-label={`View ${cert.title} certificate`}>
        {content}
      </a>
    );
  }
  return content;
}

// ─── Social Icons ────────────────────────────────────────────────────────────

function FacebookIcon() {
  return <svg fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
}

function XIcon() {
  return <svg fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
}

function InstagramIcon() {
  return <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
}

function UpworkIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return <svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
}

function GitHubIcon() {
  return <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>;
}
