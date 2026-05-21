import { notFound } from "next/navigation";
import { getUserByUsername, getProjectById } from "@/lib/data";
import ProjectDetailClient from "@/app/project/[id]/ProjectDetailClient";

export default async function UserProjectPage({
  params,
}: {
  params: Promise<{ userId: string; id: string }>;
}) {
  const { userId, id } = await params;
  const user = await getUserByUsername(userId);

  if (!user) {
    notFound();
  }

  const projectId = parseInt(id, 10);
  if (isNaN(projectId)) {
    notFound();
  }

  const project = await getProjectById(projectId, user.id);
  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} userId={user.id} username={userId} />;
}
