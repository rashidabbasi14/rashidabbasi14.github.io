import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { getUserById, getLandingStats, getPortfolios } from "@/lib/data";
import UserButtonWrapper from "@/components/UserButtonWrapper";
import PortfolioCard from "@/components/PortfolioCard";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "PortfolioBuilder";

export default async function LandingPage() {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  // Fetch username for signed-in users to build "My Portfolio" link
  let username: string | null = null;
  if (userId) {
    try {
      const user = await getUserById(userId);
      username = user?.username ?? null;
    } catch {
      // User might not exist yet
    }
  }

  // Fetch real aggregate stats from the database
  const stats = await getLandingStats();

  // Fetch featured portfolios
  const portfolios = await getPortfolios();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0e1726" }}>
      {/* ─── Skip to content (accessibility) ──────────────────────── */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* ─── Navigation ─────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 shadow-sm"
        style={{ backgroundColor: "#0b2341" }}
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center shrink-0" aria-label={`${siteName} home`}>
            <Image
              src="/uploads/logo.webp"
              alt={siteName}
              width={40}
              height={40}
              className="w-9 h-9 md:w-10 md:h-10 object-contain"
              priority
            />
          </Link>
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <>
                {username && (
                  <Link
                    href={`/${username}`}
                    className="px-4 py-2 rounded-lg text-sm font-medium no-underline transition-all duration-200 hover:opacity-80"
                    style={{
                      backgroundColor: "rgba(71, 184, 255, 0.08)",
                      color: "#47b8ff",
                      border: "1px solid rgba(71, 184, 255, 0.2)",
                    }}
                  >
                    My Portfolio
                  </Link>
                )}
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-lg text-sm font-medium no-underline"
                  style={{
                    backgroundColor: "#47b8ff",
                    color: "#0b2341",
                  }}
                >
                  Dashboard
                </Link>
                <UserButtonWrapper />
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium no-underline"
                style={{
                  backgroundColor: "#47b8ff",
                  color: "#0b2341",
                }}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ──────────────────────────────────────────── */}
      <section
        id="main-content"
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(11, 35, 65, 0.85), rgba(5, 14, 30, 0.92)), url('/uploads/background.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-label="Hero section"
      >
        {/* Background decoration */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(71,184,255,0.4) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 py-28 md:py-36 text-center relative">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ color: "#f8fbff" }}>
            Build Your{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #47b8ff, #7dd3fc)",
              }}
            >
              Professional Portfolio
            </span>{" "}
            in Minutes
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto" style={{ color: "#c8d6e5" }}>
            Showcase your skills, projects, and experience with a stunning,
            personalized portfolio website. No coding required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={isSignedIn ? "/admin" : "/login"}
              className="px-8 py-3.5 rounded-lg text-lg font-semibold no-underline inline-flex items-center gap-2 transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: "#47b8ff",
                color: "#0b2341",
              }}
            >
              {isSignedIn ? "Go to Dashboard" : "Create Your Portfolio"}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="#features"
              className="px-8 py-3.5 rounded-lg text-lg font-semibold no-underline inline-flex items-center gap-2 transition-all duration-200 hover:scale-105"
              style={{
                border: "1px solid rgba(71, 184, 255, 0.3)",
                color: "#47b8ff",
              }}
            >
              Learn More
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─────────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-12" aria-label="Platform statistics">
        <div
          className="rounded-2xl p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(16, 31, 60, 0.96), rgba(8, 17, 30, 0.95))",
            border: "1px solid rgba(71, 184, 255, 0.16)",
          }}
        >
          <div>
            <div className="text-3xl font-bold mb-1" style={{ color: "#47b8ff" }}>
              {stats.totalUsers}
            </div>
            <div className="text-sm" style={{ color: "#c8d6e5" }}>
              Total Portfolios
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1" style={{ color: "#22c55e" }}>
              {stats.totalPublic}
            </div>
            <div className="text-sm" style={{ color: "#c8d6e5" }}>
              Public
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1" style={{ color: "#f59e0b" }}>
              {stats.totalPrivate}
            </div>
            <div className="text-sm" style={{ color: "#c8d6e5" }}>
              Private
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1" style={{ color: "#47b8ff" }}>
              {stats.totalSkills}+
            </div>
            <div className="text-sm" style={{ color: "#c8d6e5" }}>
              Technologies Supported
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1" style={{ color: "#47b8ff" }}>
              {stats.totalProjects}+
            </div>
            <div className="text-sm" style={{ color: "#c8d6e5" }}>
              Projects Showcased
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1" style={{ color: "#47b8ff" }}>
              Free
            </div>
            <div className="text-sm" style={{ color: "#c8d6e5" }}>
              To Get Started
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Portfolios Section ────────────────────────────── */}
      {portfolios.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#f8fbff" }}>
              Featured Portfolios
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "#b0c4de" }}>
              Explore portfolios built by our community members.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {portfolios.map((p) => (
              <PortfolioCard
                key={p.username}
                username={p.username}
                name={p.name}
                tagline={p.tagline}
                image={p.image}
                projectCount={p.projectCount}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── Features Section ──────────────────────────────────────── */}
      <section id="features" className="container mx-auto px-4 py-20" aria-label="Features">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#f8fbff" }}>
            Everything You Need
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#c8d6e5" }}>
            All the tools to create a professional portfolio that stands out.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-xl transition-all duration-300 hover:translate-y-[-4px]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(16, 31, 60, 0.96), rgba(8, 17, 30, 0.95))",
                border: "1px solid rgba(71, 184, 255, 0.16)",
              }}
            >
              <div
                className="text-3xl mb-5 w-14 h-14 flex items-center justify-center rounded-xl"
                style={{ backgroundColor: "rgba(71, 184, 255, 0.1)" }}
                aria-hidden="true"
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: "#f8fbff" }}>
                {feature.title}
              </h3>
              <p className="leading-relaxed" style={{ color: "#c8d6e5" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-20" aria-label="How it works">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#f8fbff" }}>
            How It Works
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#c8d6e5" }}>
            Get your portfolio live in four simple steps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector line (desktop) */}
          <div
            className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px"
            style={{ backgroundColor: "rgba(71, 184, 255, 0.2)" }}
            aria-hidden="true"
          />
          {steps.map((step, i) => (
            <div key={i} className="text-center relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-xl font-bold relative z-10"
                style={{
                  backgroundColor: "rgba(71, 184, 255, 0.1)",
                  color: "#47b8ff",
                  border: "1px solid rgba(71, 184, 255, 0.2)",
                }}
                aria-hidden="true"
              >
                {i + 1}
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#f8fbff" }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#c8d6e5" }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Section ───────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-20" aria-label="Call to action">
        <div
          className="relative overflow-hidden rounded-2xl p-12 md:p-16 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(71, 184, 255, 0.12), rgba(11, 35, 65, 0.9))",
            border: "1px solid rgba(71, 184, 255, 0.2)",
          }}
        >
          {/* Decorative glow */}
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(71,184,255,0.6) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#f8fbff" }}>
              Ready to Showcase Your Work?
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "#c8d6e5" }}>
              Join thousands of professionals who trust {siteName} to build
              their online presence.
            </p>
            <Link
              href={isSignedIn ? "/admin" : "/login"}
              className="px-8 py-3.5 rounded-lg text-lg font-semibold no-underline inline-flex items-center gap-2 transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: "#47b8ff",
                color: "#0b2341",
              }}
            >
              {isSignedIn ? "Go to Dashboard" : "Get Started Free"}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────── */}
      <footer
        className="py-8 text-center text-sm"
        style={{
          backgroundColor: "#0b2341",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          color: "#c8d6e5",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center shrink-0" aria-label={`${siteName} home`}>
              <Image
                src="/uploads/logo.webp"
                alt={siteName}
                width={28}
                height={28}
                className="w-6 h-6 md:w-7 md:h-7 object-contain"
              />
            </Link>
            <p>
              Powered by{" "}
              <span style={{ color: "#47b8ff" }}>{siteName}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: "🎨",
    title: "Customizable Themes",
    description:
      "Choose from beautiful templates and customize colors, fonts, and layouts to match your personal brand.",
  },
  {
    icon: "📱",
    title: "Responsive Design",
    description:
      "Your portfolio looks great on all devices — desktop, tablet, and mobile. Built with modern CSS and Tailwind.",
  },
  {
    icon: "🔗",
    title: "Your Own Subdomain",
    description:
      "Get a personalized subdomain (e.g., yourname.portfoliobuilder.com) to share with employers and clients.",
  },
  {
    icon: "💼",
    title: "Project Showcase",
    description:
      "Display your work with rich descriptions, images, GitHub links, and live demos. Impress potential employers.",
  },
  {
    icon: "📊",
    title: "Skills & Experience",
    description:
      "Organize your skills by category, highlight your work experience, and list certifications all in one place.",
  },
  {
    icon: "📬",
    title: "Contact Form",
    description:
      "Let visitors reach out to you directly through your portfolio with an integrated contact form.",
  },
];

const steps = [
  {
    title: "Sign Up",
    description: "Create your account with Google OAuth in one click.",
  },
  {
    title: "Choose Username",
    description: "Pick your unique subdomain username.",
  },
  {
    title: "Add Your Content",
    description: "Fill in your profile, projects, skills, and experience.",
  },
  {
    title: "Share Your Portfolio",
    description: "Share your unique URL with the world.",
  },
];
