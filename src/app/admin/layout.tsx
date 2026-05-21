import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProfile } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin Dashboard | Rashid Ahmed Abbasi",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let profile = null;
  try {
    profile = await getProfile();
  } catch (e) {
    // Profile might not exist yet
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0e1726" }}>
      <Navbar isAdmin />
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
