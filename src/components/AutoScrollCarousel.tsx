"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface AutoScrollCarouselProps {
  children: React.ReactNode[];
  speed?: number; // pixels per second
  pauseOnHover?: boolean;
  title?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export default function AutoScrollCarousel({
  children,
  speed = 40,
  pauseOnHover = true,
  title,
  viewAllHref,
  viewAllLabel = "View all",
}: AutoScrollCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<number | null>(null);
  const scrollPosRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Duplicate children for seamless loop
  const duplicatedItems = [...children, ...children, ...children];

  const animate = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (!isPaused && trackRef.current) {
        scrollPosRef.current += (speed * delta) / 1000;

        // Single item width = total width of one set of children
        const singleSetWidth = trackRef.current.scrollWidth / 3;
        if (scrollPosRef.current >= singleSetWidth) {
          scrollPosRef.current = 0;
        }

        trackRef.current.style.transform = `translateX(-${scrollPosRef.current}px)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    },
    [isPaused, speed]
  );

  useEffect(() => {
    lastTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  return (
    <section className="py-5">
      <div className="container mx-auto px-4 mb-4">
        <div className="flex items-center justify-between">
          {title && <h2 className="section-heading mb-0">{title}</h2>}
          {viewAllHref && (
            <a
              href={viewAllHref}
              className="text-sm px-3 py-1.5 rounded-xl font-medium transition-all duration-200"
              style={{
                background: "rgba(71,184,255,0.1)",
                border: "1px solid rgba(71,184,255,0.3)",
                color: "#47b8ff",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(71,184,255,0.2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(71,184,255,0.1)"; }}
            >
              {viewAllLabel}
            </a>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 overflow-hidden">
        <div
          onMouseEnter={() => pauseOnHover && setIsPaused(true)}
          onMouseLeave={() => pauseOnHover && setIsPaused(false)}
          onTouchStart={() => pauseOnHover && setIsPaused(true)}
          onTouchEnd={() => pauseOnHover && setIsPaused(false)}
        >
          {/* Scrolling track */}
          <div
            ref={trackRef}
            className="flex gap-6"
            style={{ willChange: "transform" }}
          >
            {duplicatedItems.map((child, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[85vw] sm:w-[45vw] lg:w-[30vw]"
                style={{ maxWidth: "400px" }}
              >
                <div className="h-full">
                  {child}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pause indicator */}
      {isPaused && (
        <div className="flex justify-center mt-3">
          <span
            className="text-xs px-3 py-1 rounded-full transition-opacity duration-300"
            style={{
              backgroundColor: "rgba(71,184,255,0.15)",
              color: "#47b8ff",
            }}
          >
            Paused
          </span>
        </div>
      )}
    </section>
  );
}
