import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PortfolioBuilder | Create Your Professional Portfolio",
    template: "%s | PortfolioBuilder",
  },
  description:
    "Build a stunning professional portfolio website in minutes. Showcase your skills, projects, and experience with a personalized portfolio page.",
  keywords: [
    "portfolio builder",
    "professional portfolio",
    "developer portfolio",
    "online resume",
    "personal website",
  ],
  icons: {
    icon: "/uploads/logo.png",
    apple: "/uploads/logo.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "PortfolioBuilder | Create Your Professional Portfolio",
    description:
      "Build a stunning professional portfolio website in minutes. Showcase your skills, projects, and experience with a personalized portfolio page.",
    type: "website",
  },
};

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
