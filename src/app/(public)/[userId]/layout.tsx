import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { getUserByUsername, getProfile } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const { userId } = await params;
  const user = await getUserByUsername(userId);

  if (user) {
    const profile = await getProfile(user.id);
    if (profile?.name) {
      const title = profile.title
        ? `${profile.name} | ${profile.title}`
        : profile.name;
      return {
        title,
        description: profile.aboutMe
          ? profile.aboutMe.slice(0, 160)
          : `Professional portfolio of ${profile.name}`,
        openGraph: {
          title,
          description: profile.aboutMe?.slice(0, 160),
        },
      };
    }
  }

  return {
    title: "Portfolio",
    description: "Professional portfolio showcasing skills, projects, and experience.",
  };
}

export default async function UserPortfolioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}) {
  // The userId param is actually the username from the URL
  const { userId } = await params;

  return (
    <>
      <Navbar username={userId} />
      {children}
    </>
  );
}
