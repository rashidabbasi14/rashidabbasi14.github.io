import { notFound } from "next/navigation";
import { getUserByUsername, getProjects } from "@/lib/data";
import ProjectsClient from "@/app/projects/ProjectsClient";

export default async function UserProjectsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getUserByUsername(userId);

  if (!user) {
    notFound();
  }

  const projects = await getProjects(user.id);

  return <ProjectsClient projects={projects} userId={user.id} username={userId} />;
}
