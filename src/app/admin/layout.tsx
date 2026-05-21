import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProfile, getUserById } from "@/lib/data";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "PortfolioBuilder";

export const metadata: Metadata = {
  title: `Admin Dashboard | ${siteName}`,
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  let profile = null;
  let username: string | undefined;

  if (userId) {
    try {
      profile = await getProfile(userId);
      const user = await getUserById(userId);
      username = user?.username ?? undefined;
    } catch (e) {
      // Profile or user might not exist yet
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0e1726" }}>
      <Navbar isAdmin username={username} />
      <main className="flex-1">{children}</main>
      {profile && (
        <Footer
          email={profile.email}
          phone={profile.phone ?? undefined}
          location={profile.location ?? undefined}
          aboutText={profile.footerAboutMe}
          social={profile.social as any}
        />
      )}
    </div>
  );
}
