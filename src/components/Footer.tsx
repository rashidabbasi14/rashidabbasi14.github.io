import Link from "next/link";

interface SocialLinks {
  facebook?: string;
  x?: string;
  instagram?: string;
  upwork?: string;
  linkedin?: string;
  github?: string;
}

interface FooterProps {
  email?: string;
  phone?: string;
  location?: string;
  aboutText?: string;
  social?: SocialLinks;
  onContactClick?: () => void;
}

export default function Footer({ email, phone, location, aboutText, social, onContactClick }: FooterProps) {
  return (
    <footer className="text-white py-5" style={{ backgroundColor: "#0b2341", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Contact Info */}
          <div>
            <h5 className="text-white font-semibold mb-4 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5" style={{ "--tw-after-bg": "#47b8ff" } as React.CSSProperties}>
              Contact
            </h5>
            <div className="space-y-3">
              {email && (
                <a href={`mailto:${email}`} className="flex items-center gap-3 text-white/85 hover:text-white transition-all duration-200 hover:translate-x-1 group">
                  <span className="w-9 h-9 flex items-center justify-center rounded-full text-sm flex-shrink-0 transition-colors group-hover:bg-[#47b8ff] group-hover:text-[#0b2341]" style={{ backgroundColor: "rgba(71,184,255,0.15)", color: "#47b8ff" }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  </span>
                  <span>{email}</span>
                </a>
              )}
              {phone && (
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 flex items-center justify-center rounded-full text-sm flex-shrink-0" style={{ backgroundColor: "rgba(71,184,255,0.15)", color: "#47b8ff" }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  </span>
                  <span>{phone}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 flex items-center justify-center rounded-full text-sm flex-shrink-0" style={{ backgroundColor: "rgba(71,184,255,0.15)", color: "#47b8ff" }}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  </span>
                  <span>{location}</span>
                </div>
              )}
            </div>
          </div>

          {/* About */}
          <div className="hidden md:block lg:col-span-2">
            <h5 className="text-white font-semibold mb-4 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5" style={{ "--tw-after-bg": "#47b8ff" } as React.CSSProperties}>
              About Me
            </h5>
            <p className="text-white/80 text-sm leading-relaxed">
              {aboutText || "Senior software developer building finance-grade web apps, APIs, and automation systems. Always focused on clean architecture and strong delivery."}
            </p>
          </div>

          {/* Social Links */}
          <div>
            <h5 className="text-white font-semibold mb-4 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5" style={{ "--tw-after-bg": "#47b8ff" } as React.CSSProperties}>
              Connect With Me
            </h5>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                {social?.facebook && <SocialButton href={social.facebook} title="Facebook"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></SocialButton>}
                {social?.x && <SocialButton href={social.x} title="X (Twitter)"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></SocialButton>}
                {social?.instagram && <SocialButton href={social.instagram} title="Instagram"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></SocialButton>}
              </div>
              <div className="h-px w-[calc(3*44px)]" style={{ backgroundColor: "rgba(71,184,255,0.25)" }} />
              <div className="flex gap-2">
                {social?.linkedin && <SocialButton href={social.linkedin} title="LinkedIn"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></SocialButton>}
                {social?.upwork && <SocialButton href={social.upwork} title="Upwork"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/></svg></SocialButton>}
                {social?.github && <SocialButton href={social.github} title="GitHub"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg></SocialButton>}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 text-center text-white/60 text-sm" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          &copy; {new Date().getFullYear()} Rashid Ahmed Abbasi. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

function SocialButton({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className="w-10 h-10 flex items-center justify-center rounded-xl text-white/85 transition-all duration-200 hover:bg-[#47b8ff] hover:text-[#0b2341] hover:-translate-y-0.5"
      style={{ backgroundColor: "rgba(71,184,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}
    >
      {children}
    </a>
  );
}
