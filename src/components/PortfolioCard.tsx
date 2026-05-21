"use client";

import Link from "next/link";
import { useState } from "react";

interface PortfolioCardProps {
  username: string;
  name: string;
  tagline: string;
  image: string;
  projectCount: number;
}

export default function PortfolioCard({
  username,
  name,
  tagline,
  image,
  projectCount,
}: PortfolioCardProps) {
  const [imgError, setImgError] = useState(false);

  const imgSrc = image.startsWith("http") ? image : `/${image.replace(/^\/+/, "")}`;

  return (
    <Link
      href={`/${username}`}
      className="group portfolio-card flex flex-col items-center text-center p-6 no-underline transition-all duration-300 hover:translate-y-[-6px]"
      aria-label={`View portfolio of ${name}`}
    >
      {/* Profile Image */}
      <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 ring-2 ring-white/10 group-hover:ring-[#47b8ff]/50 transition-all duration-300">
        {imgError ? (
          <div
            className="flex items-center justify-center w-full h-full rounded-full text-lg font-bold"
            style={{
              background: "rgba(71,184,255,0.2)",
              color: "#47b8ff",
            }}
            aria-hidden="true"
          >
            {name.substring(0, 2).toUpperCase()}
          </div>
        ) : (
          <img
            src={imgSrc}
            alt={`Portrait of ${name}`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}
      </div>
      {/* Name & Tagline */}
      <h3 className="text-white font-semibold text-base mb-1 group-hover:text-[#47b8ff] transition-colors">
        {name}
      </h3>
      <p className="text-[#c8d6e5] text-xs mb-3 line-clamp-2">{tagline}</p>
      {/* Project Count Badge */}
      <div
        className="mt-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: "rgba(71,184,255,0.1)",
          color: "#47b8ff",
          border: "1px solid rgba(71,184,255,0.2)",
        }}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        {projectCount} {projectCount === 1 ? "Project" : "Projects"}
      </div>
    </Link>
  );
}
