"use client";

import { useState, useRef, useEffect } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export default function ContactModal({ isOpen, onClose, email }: ContactModalProps) {
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setStatus(null);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "info", message: "Sending your message..." });

    try {
      const formData = new FormData();
      formData.append("access_key", "de95366b-02c8-474b-9a89-9a9cb1c8ce3e");
      formData.append("name", formState.name);
      formData.append("email", formState.email);
      formData.append("subject", formState.subject);
      formData.append("message", formState.message);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setStatus({ type: "success", message: "Message sent successfully! I'll get back to you soon." });
        setFormState({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => onClose(), 1500);
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch {
      setStatus({
        type: "error",
        message: `Failed to send message. Please try again or email me directly at ${email}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-2xl shadow-2xl z-10"
        style={{
          background: "linear-gradient(180deg, rgba(16,31,60,0.98), rgba(8,17,30,0.98))",
          border: "1px solid rgba(71,184,255,0.2)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(71,184,255,0.1)" }}>
          <h5 className="text-white font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" style={{ color: "#47b8ff" }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            Send Me a Message
          </h5>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/85 text-sm font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/40 transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)", "--tw-ring-color": "rgba(71,184,255,0.3)" } as React.CSSProperties}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-white/85 text-sm font-medium mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/40 transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)", "--tw-ring-color": "rgba(71,184,255,0.3)" } as React.CSSProperties}
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-white/85 text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                required
                value={formState.subject}
                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/40 transition-all duration-200 focus:outline-none focus:ring-2"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)", "--tw-ring-color": "rgba(71,184,255,0.3)" } as React.CSSProperties}
                placeholder="Project Inquiry"
              />
            </div>
            <div>
              <label className="block text-white/85 text-sm font-medium mb-1">Message</label>
              <textarea
                required
                rows={5}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/40 transition-all duration-200 focus:outline-none focus:ring-2 resize-none"
                style={{ backgroundColor: "rgba(11,35,65,0.6)", border: "1px solid rgba(71,184,255,0.15)", "--tw-ring-color": "rgba(71,184,255,0.3)" } as React.CSSProperties}
                placeholder="Your message here..."
              />
            </div>

            {status && (
              <div
                className={`px-4 py-3 rounded-xl text-sm ${
                  status.type === "success" ? "bg-green-900/50 text-green-300 border border-green-700" :
                  status.type === "error" ? "bg-red-900/50 text-red-300 border border-red-700" :
                  "bg-blue-900/50 text-blue-300 border border-blue-700"
                }`}
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: "transparent",
                border: "1px solid #47b8ff",
                color: "#47b8ff",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(71,184,255,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                  Send Message
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
