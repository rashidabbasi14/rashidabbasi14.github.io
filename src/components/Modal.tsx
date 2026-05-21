"use client";

import { useEffect, useCallback } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Optional image to show at the top of the modal */
  image?: string | null;
  /** Shape of the image: "rounded" (default), "circle", or "cover" (full-width banner) */
  imageShape?: "rounded" | "circle" | "cover";
  /** Width of the image when shape is "rounded" or "circle" */
  imageWidth?: number;
  /** Height of the image when shape is "rounded" or "circle" */
  imageHeight?: number;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  image,
  imageShape = "rounded",
  imageWidth = 120,
  imageHeight = 80,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const imageStyle: React.CSSProperties =
    imageShape === "circle"
      ? {
          width: imageWidth,
          height: imageWidth,
          borderRadius: "50%",
          objectFit: "cover",
          border: "3px solid rgba(71,184,255,0.3)",
          boxShadow: "0 0 0 4px rgba(255,255,255,0.08)",
        }
      : imageShape === "cover"
      ? {
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "0.75rem",
        }
      : {
          width: imageWidth,
          height: imageHeight,
          objectFit: "cover",
          borderRadius: "0.5rem",
          border: "2px solid rgba(71,184,255,0.3)",
        };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{
          backgroundColor: "#0e1726",
          border: "1px solid rgba(71,184,255,0.15)",
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{
            backgroundColor: "#0e1726",
            borderBottom: "1px solid rgba(71,184,255,0.1)",
          }}
        >
          <h2 className="text-white font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image at top */}
        {image && (
          <div className="flex justify-center px-6 pt-6 pb-2">
            <img src={image} alt="Preview" style={imageStyle} />
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
