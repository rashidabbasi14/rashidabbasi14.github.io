"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "PortfolioBuilder";

export default function OnboardingPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/login");
      return;
    }

    // Check if user already has a username in our DB
    async function checkUser() {
      try {
        const res = await fetch(`/api/user/me`);
        if (res.ok) {
          const data = await res.json();
          if (data.username) {
            // User already has a username, redirect to admin
            router.push("/admin");
            return;
          }
          // Pre-fill with email local part
          const emailLocal = user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "";
          setUsername(emailLocal.replace(/[^a-zA-Z0-9_-]/g, ""));
        }
      } catch {
        // User doesn't exist yet, pre-fill from email
        const emailLocal = user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "";
        setUsername(emailLocal.replace(/[^a-zA-Z0-9_-]/g, ""));
      } finally {
        setChecking(false);
      }
    }
    checkUser();
  }, [isLoaded, isSignedIn, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = username.trim().toLowerCase();
    if (!trimmed) {
      setError("Username is required");
      return;
    }
    if (!/^[a-z0-9_-]{3,30}$/.test(trimmed)) {
      setError(
        "Username must be 3-30 characters and can only contain letters, numbers, hyphens, and underscores"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to set username");
        setLoading(false);
        return;
      }

      // Success — redirect to admin
      router.push("/admin");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!isLoaded || checking) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#0e1726" }}
      >
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: "#47b8ff" }}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#0e1726" }}
    >
      <Link
        href="/"
        className="text-2xl font-bold mb-8 no-underline"
        style={{ color: "#f8fbff" }}
      >
        {siteName}
      </Link>

      <div
        className="w-full max-w-md p-8 rounded-2xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(16, 31, 60, 0.96), rgba(8, 17, 30, 0.95))",
          border: "1px solid rgba(71, 184, 255, 0.16)",
        }}
      >
        <h1
          className="text-2xl font-bold mb-2 text-center"
          style={{ color: "#f8fbff" }}
        >
          Welcome to {siteName}!
        </h1>
        <p
          className="text-sm mb-6 text-center"
          style={{ color: "#b0c4de" }}
        >
          Choose your unique username. This will be your portfolio subdomain.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#b0c4de" }}
            >
              Username
            </label>
            <div
              className="flex items-center rounded-lg overflow-hidden"
              style={{
                border: error
                  ? "1px solid #ef4444"
                  : "1px solid rgba(71, 184, 255, 0.2)",
              }}
            >
              <span
                className="px-3 py-2.5 text-sm"
                style={{
                  backgroundColor: "rgba(71, 184, 255, 0.1)",
                  color: "#b0c4de",
                  borderRight: "1px solid rgba(71, 184, 255, 0.2)",
                }}
              >
                {typeof window !== "undefined" &&
                window.location.hostname !== "localhost"
                  ? `${username || "you"}.`
                  : "/"}
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="your-username"
                className="flex-1 px-3 py-2.5 text-sm outline-none"
                style={{
                  backgroundColor: "#0e1726",
                  color: "#f8fbff",
                }}
                autoFocus
                maxLength={30}
              />
            </div>
            {error && (
              <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
                {error}
              </p>
            )}
            <p className="text-xs mt-1" style={{ color: "#b0c4de" }}>
              Your portfolio will be accessible at{" "}
              <span style={{ color: "#47b8ff" }}>
                {username || "your-username"}
                {typeof window !== "undefined" &&
                window.location.hostname !== "localhost"
                  ? `.${window.location.hostname.replace(/^www\./, "")}`
                  : `/your-username`}
              </span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50"
            style={{
              backgroundColor: "#47b8ff",
              color: "#0b2341",
            }}
          >
            {loading ? "Setting up..." : "Create My Portfolio"}
          </button>
        </form>
      </div>
    </div>
  );
}
