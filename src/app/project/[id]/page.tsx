import Navbar from "@/components/Navbar";
import ProjectDetailClient from "./ProjectDetailClient";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <Navbar />
      <ProjectDetailClient projectId={id} />
    </>
  );
}
