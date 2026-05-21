import { notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/data";
import HomeClient from "@/app/HomeClient";

export default async function UserPortfolioPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getUserByUsername(userId);

  if (!user) {
    notFound();
  }

  return <HomeClient userId={user.id} username={userId} />;
}
