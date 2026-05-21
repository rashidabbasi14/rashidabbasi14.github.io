"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { UserButton } from "@clerk/nextjs";

interface NavbarProps {
  isAdmin?: boolean;
}

export default function Navbar({ isAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const scrollToContact = useCallback(() => {
    if (pathname === "/") {
      // Already on home page, scroll directly
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    // Navigate to home page with hash
    router.push("/#contact");
  }, [pathname, router]);

  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: "#0b2341" }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link href="/admin" className="text-white/70 hover:text-white text-sm hidden md:block">
                &larr; Dashboard
              </Link>
            )}
            <Link href={isAdmin ? "/admin" : "/"} className="text-white font-bold text-lg tracking-wide">
              {isAdmin ? "Admin Panel" : "Rashid Ahmed Abbasi"}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-1">
            {isAdmin ? (
              <>
                <NavLink href="/admin">Dashboard</NavLink>
                <NavLink href="/admin/profile">Profile</NavLink>
                <NavLink href="/admin/projects">Projects</NavLink>
                <NavLink href="/admin/employment">Employment</NavLink>
                <NavLink href="/admin/skills">Skills</NavLink>
                <NavLink href="/admin/certifications">Certifications</NavLink>
                <NavLink href="/admin/education">Education</NavLink>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white px-3 py-2 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all duration-200 hover:bg-white/10"
                >
                  View Site
                </Link>
                <div className="ml-2">
                  <UserButton />
                </div>
              </>
            ) : (
              <>
                <NavLink href="/#home">Home</NavLink>
                <NavLink href="/#employment">Employment</NavLink>
                <NavLink href="/projects">Projects</NavLink>
                <NavLink href="/#certifications">Certifications</NavLink>
                <button
                  onClick={scrollToContact}
                  className="text-white/90 hover:text-white px-3 py-2 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all duration-200 hover:bg-white/10 hover:shadow-lg cursor-pointer"
                >
                  Contact
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {isAdmin ? (
              <>
                <MobileNavLink href="/admin" onClick={handleMobileLinkClick}>Dashboard</MobileNavLink>
                <MobileNavLink href="/admin/profile" onClick={handleMobileLinkClick}>Profile</MobileNavLink>
                <MobileNavLink href="/admin/projects" onClick={handleMobileLinkClick}>Projects</MobileNavLink>
                <MobileNavLink href="/admin/employment" onClick={handleMobileLinkClick}>Employment</MobileNavLink>
                <MobileNavLink href="/admin/skills" onClick={handleMobileLinkClick}>Skills</MobileNavLink>
                <MobileNavLink href="/admin/certifications" onClick={handleMobileLinkClick}>Certifications</MobileNavLink>
                <MobileNavLink href="/admin/education" onClick={handleMobileLinkClick}>Education</MobileNavLink>
                <MobileNavLink href="/" onClick={handleMobileLinkClick}>View Site</MobileNavLink>
                <div className="px-4 py-2">
                  <UserButton />
                </div>
              </>
            ) : (
              <>
                <MobileNavLink href="/#home" onClick={handleMobileLinkClick}>Home</MobileNavLink>
                <MobileNavLink href="/#employment" onClick={handleMobileLinkClick}>Employment</MobileNavLink>
                <MobileNavLink href="/projects" onClick={handleMobileLinkClick}>Projects</MobileNavLink>
                <MobileNavLink href="/#certifications" onClick={handleMobileLinkClick}>Certifications</MobileNavLink>
                <button
                  onClick={() => { setIsOpen(false); scrollToContact(); }}
                  className="block text-white/90 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold tracking-wide uppercase transition-all duration-200 hover:bg-white/10 w-full text-left cursor-pointer"
                >
                  Contact
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-white/90 hover:text-white px-3 py-2 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all duration-200 hover:bg-white/10 hover:shadow-lg relative"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block text-white/90 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold tracking-wide uppercase transition-all duration-200 hover:bg-white/10"
    >
      {children}
    </Link>
  );
}
