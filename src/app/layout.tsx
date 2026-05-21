import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Rashid Abbasi | Full-Stack Software Engineer",
    template: "%s | Rashid Abbasi",
  },
  description:
    "Full-stack software engineer specializing in building finance-grade web apps, APIs, and automation systems. View my portfolio, projects, and experience.",
  keywords: [
    "Rashid Abbasi",
    "software engineer",
    "full-stack developer",
    "portfolio",
    "web developer",
    "finance software",
    "API development",
  ],
  authors: [{ name: "Rashid Abbasi" }],
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Rashid Abbasi | Full-Stack Software Engineer",
    description:
      "Full-stack software engineer specializing in building finance-grade web apps, APIs, and automation systems.",
    type: "website",
    locale: "en_US",
    siteName: "Rashid Abbasi Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rashid Abbasi | Full-Stack Software Engineer",
    description:
      "Full-stack software engineer specializing in building finance-grade web apps, APIs, and automation systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} h-full antialiased`}>
        <head>
          {/* Preconnect to critical origins */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link rel="preconnect" href="https://clerk.accounts.dev" />
          <link rel="dns-prefetch" href="https://clerk.accounts.dev" />
        </head>
        <body className="min-h-full flex flex-col font-sans">{children}</body>
      </html>
    </ClerkProvider>
  );
}
