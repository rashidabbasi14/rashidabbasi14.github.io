import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Professional portfolio showcasing skills, projects, and experience.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
