import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "PortfolioBuilder";

export default function LoginPage() {
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
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-[#0b2341] shadow-xl border border-[rgba(71,184,255,0.16)]",
            headerTitle: "text-[#f8fbff]",
            headerSubtitle: "text-[#b0c4de]",
            socialButtonsBlockButton:
              "bg-white hover:bg-gray-100 text-gray-900 border border-gray-300",
            formFieldLabel: "text-[#b0c4de]",
            formFieldInput:
              "bg-[#0e1726] border-[rgba(71,184,255,0.2)] text-[#f8fbff]",
            formButtonPrimary:
              "bg-[#47b8ff] hover:bg-[#3a9ee0] text-[#0b2341]",
            footerActionLink: "text-[#47b8ff]",
            identityPreviewText: "text-[#b0c4de]",
            identityPreviewEditButton: "text-[#47b8ff]",
          },
        }}
      />
    </div>
  );
}
