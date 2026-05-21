import { getProjects } from "@/lib/data";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProjectsClient from "./ProjectsClient";

export default async function ProjectsPage() {
  // For the standalone projects page (non-subdomain), fetch first user's projects
  const [firstUser] = await db.select().from(users).limit(1);
  if (!firstUser) {
    return <ProjectsClient projects={[]} />;
  }

  const projects = await getProjects(firstUser.id);

  return <ProjectsClient projects={projects} userId={firstUser.id} />;
}
