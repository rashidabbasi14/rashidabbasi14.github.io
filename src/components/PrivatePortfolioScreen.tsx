import Link from "next/link";

export default function PrivatePortfolioScreen() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: "#0e1726" }}
    >
      <div className="max-w-md text-center">
        {/* Lock Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "rgba(71,184,255,0.1)" }}
        >
          <svg
            className="w-10 h-10"
            style={{ color: "#47b8ff" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h1
          className="text-2xl md:text-3xl font-bold mb-3"
          style={{ color: "#f8fbff" }}
        >
          This Portfolio is Private
        </h1>

        <p className="text-base mb-8" style={{ color: "#b0c4de" }}>
          The owner has set this portfolio to private. It is not accessible
          to the public.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 no-underline"
          style={{
            background: "rgba(71,184,255,0.1)",
            border: "1px solid rgba(71,184,255,0.3)",
            color: "#47b8ff",
          }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
