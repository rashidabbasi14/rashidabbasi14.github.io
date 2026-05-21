import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { getProfile } from "@/lib/data";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const profile = await getProfile();
    if (profile?.name) {
      const title = profile.title
        ? `${profile.name} | ${profile.title}`
        : profile.name;
      return {
        title,
        description:
          profile.description ||
          "Expert in .NET Core, React, and Banking-Grade Financial Systems. Delivering scalable architecture for mission-critical applications.",
        keywords: [
          "software engineer",
          "full-stack developer",
          ".NET Core",
          "React",
          "portfolio",
          profile.name,
        ],
        icons: {
          icon: [
            { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon.ico" },
          ],
          apple: [
            { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
          ],
        },
        manifest: "/site.webmanifest",
        openGraph: {
          title,
          description:
            profile.description ||
            "Expert in .NET Core, React, and Banking-Grade Financial Systems.",
          type: "website",
        },
      };
    }
  } catch {
    // Profile might not exist yet, fall through to defaults
  }

  return {
    title: "Rashid Ahmed Abbasi | Software Engineer",
    description:
      "Expert in .NET Core, React, and Banking-Grade Financial Systems. Delivering scalable architecture for mission-critical applications.",
    keywords: [
      "software engineer",
      "full-stack developer",
      ".NET Core",
      "React",
      "portfolio",
      "Rashid Ahmed Abbasi",
    ],
    icons: {
      icon: [
        { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon.ico" },
      ],
      apple: [
        { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/site.webmanifest",
    openGraph: {
      title: "Rashid Ahmed Abbasi | Software Engineer",
      description:
        "Expert in .NET Core, React, and Banking-Grade Financial Systems.",
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
