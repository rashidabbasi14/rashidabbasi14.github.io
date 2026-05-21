import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// POST /api/admin/projects — Create
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [created] = await db
      .insert(projects)
      .values({
        title: body.title,
        subtitle: body.subtitle || null,
        description: body.description || null,
        coverImage: body.coverImage || null,
        images: body.images || null,
        technologies: body.technologies || null,
        githubUrl: body.githubUrl || null,
        liveUrl: body.liveUrl || null,
        priority: body.priority || false,
        readme: body.readme || null,
      })
      .returning();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

// PUT /api/admin/projects — Update
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }
    const [updated] = await db
      .update(projects)
      .set({
        title: body.title,
        subtitle: body.subtitle ?? null,
        description: body.description ?? null,
        coverImage: body.coverImage ?? null,
        images: body.images ?? null,
        technologies: body.technologies ?? null,
        githubUrl: body.githubUrl ?? null,
        liveUrl: body.liveUrl ?? null,
        priority: body.priority ?? false,
        readme: body.readme ?? null,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, body.id))
      .returning();
    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE /api/admin/projects?id=X — Delete
export async function DELETE(request: NextRequest) {
  try {
    const id = parseInt(request.nextUrl.searchParams.get("id") || "", 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Valid project ID is required" }, { status: 400 });
    }
    await db.delete(projects).where(eq(projects.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
