"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { UserButton, useUser } from "@clerk/nextjs";

interface NavbarProps {
  isAdmin?: boolean;
  /** Username for portfolio context — used to build correct links on portfolio pages */
  username?: string;
}

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "PortfolioBuilder";

export default function Navbar({ isAdmin, username }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  // Build the base path for portfolio links
  const basePath = username ? `/${username}` : "";

  useEffect(() => {
    async function fetchProfile() {
      try {
        const query = username ? `?username=${username}` : "";
        const res = await fetch(`/api/profile${query}`);
        if (res.ok) {
          const data = await res.json();
          if (data.name) {
            setProfileName(data.name);
          }
        }
      } catch {
        // Profile might not exist yet
      }
    }
    if (!isAdmin) {
      fetchProfile();
    }
  }, [isAdmin, username]);

  // Check if the logged-in user is the owner of this portfolio
  useEffect(() => {
    async function checkOwnership() {
      if (!isSignedIn || !username || isAdmin) {
        setIsOwner(false);
        return;
      }
      try {
        const res = await fetch("/api/user/me");
        if (res.ok) {
          const user = await res.json();
          setIsOwner(user.username === username);
        }
      } catch {
        setIsOwner(false);
      }
    }
    checkOwnership();
  }, [isSignedIn, username, isAdmin]);

  const scrollToContact = useCallback(() => {
    const homePath = basePath || "/";
    if (pathname === homePath || pathname === `${homePath}/`) {
      // Already on home page, scroll directly
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    // Navigate to home page with hash
    router.push(`${homePath}/#contact`);
  }, [pathname, router, basePath]);

  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 shadow-sm" style={{ backgroundColor: "#0b2341" }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {/* Logo — always visible, links to landing page */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/uploads/logo.png"
                alt={siteName}
                width={36}
                height={36}
                className="w-8 h-8 md:w-9 md:h-9 object-contain"
              />
            </Link>
            {isAdmin && (
              <>
                <Link
                  href={username ? `/${username}` : "/"}
                  className="text-white/70 hover:text-white px-3 py-2 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all duration-200 hover:bg-white/10 hidden md:block"
                >
                  View Site
                </Link>
                <Link href="/admin" className="text-white/70 hover:text-white text-sm hidden md:block">
                  &larr; Dashboard
                </Link>
              </>
            )}
            {!isAdmin && (
              <Link href={basePath || "/"} className="text-white font-bold text-lg tracking-wide">
                {profileName || siteName}
              </Link>
            )}
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
                <NavLink href="/admin/profile">Profile</NavLink>
                <NavLink href="/admin/projects">Projects</NavLink>
                <NavLink href="/admin/employment">Employment</NavLink>
                <NavLink href="/admin/skills">Skills</NavLink>
                <NavLink href="/admin/certifications">Certifications</NavLink>
                <NavLink href="/admin/education">Education</NavLink>
                <div className="ml-2">
                  <UserButton />
                </div>
              </>
            ) : (
              <>
                <NavLink href={`${basePath}/#home`}>Home</NavLink>
                <NavLink href={`${basePath}/#employment`}>Employment</NavLink>
                <NavLink href={`${basePath}/projects`}>Projects</NavLink>
                <NavLink href={`${basePath}/#certifications`}>Certifications</NavLink>
                <button
                  onClick={scrollToContact}
                  className="text-white/90 hover:text-white px-3 py-2 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all duration-200 hover:bg-white/10 hover:shadow-lg cursor-pointer"
                >
                  Contact
                </button>
                {isOwner && (
                  <Link
                    href="/admin"
                    className="text-white/90 hover:text-white px-3 py-2 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all duration-200 hover:bg-white/10 hover:shadow-lg ml-2"
                  >
                    Dashboard
                  </Link>
                )}
                {isSignedIn && (
                  <div className="ml-2">
                    <UserButton />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {isAdmin ? (
              <>
                <MobileNavLink href="/admin/profile" onClick={handleMobileLinkClick}>Profile</MobileNavLink>
                <MobileNavLink href="/admin/projects" onClick={handleMobileLinkClick}>Projects</MobileNavLink>
                <MobileNavLink href="/admin/employment" onClick={handleMobileLinkClick}>Employment</MobileNavLink>
                <MobileNavLink href="/admin/skills" onClick={handleMobileLinkClick}>Skills</MobileNavLink>
                <MobileNavLink href="/admin/certifications" onClick={handleMobileLinkClick}>Certifications</MobileNavLink>
                <MobileNavLink href="/admin/education" onClick={handleMobileLinkClick}>Education</MobileNavLink>
                <MobileNavLink href={username ? `/${username}` : "/"} onClick={handleMobileLinkClick}>View Site</MobileNavLink>
                <div className="px-4 py-2">
                  <UserButton />
                </div>
              </>
            ) : (
              <>
                <MobileNavLink href={`${basePath}/#home`} onClick={handleMobileLinkClick}>Home</MobileNavLink>
                <MobileNavLink href={`${basePath}/#employment`} onClick={handleMobileLinkClick}>Employment</MobileNavLink>
                <MobileNavLink href={`${basePath}/projects`} onClick={handleMobileLinkClick}>Projects</MobileNavLink>
                <MobileNavLink href={`${basePath}/#certifications`} onClick={handleMobileLinkClick}>Certifications</MobileNavLink>
                <button
                  onClick={() => { setIsOpen(false); scrollToContact(); }}
                  className="block text-white/90 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold tracking-wide uppercase transition-all duration-200 hover:bg-white/10 w-full text-left cursor-pointer"
                >
                  Contact
                </button>
                {isOwner && (
                  <MobileNavLink href="/admin" onClick={handleMobileLinkClick}>Dashboard</MobileNavLink>
                )}
                {isSignedIn && (
                  <div className="px-4 py-2">
                    <UserButton />
                  </div>
                )}
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
