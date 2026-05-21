import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data";
import ProjectDetailClient from "./ProjectDetailClient";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = parseInt(id, 10);
  if (isNaN(projectId)) {
    notFound();
  }

  // For the standalone project page (non-subdomain), we fetch the first user's project
  // This is a fallback for backward compatibility
  const { getUserById } = await import("@/lib/data");
  const { users } = await import("@/db/schema");
  const { db } = await import("@/db");
  const { eq } = await import("drizzle-orm");

  const [firstUser] = await db.select().from(users).limit(1);
  if (!firstUser) {
    notFound();
  }

  const project = await getProjectById(projectId, firstUser.id);
  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} userId={firstUser.id} />;
}
