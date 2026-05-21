import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/admin/projects
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(projects.sortOrder);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST /api/admin/projects — Create
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const [created] = await db
      .insert(projects)
      .values({
        userId,
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
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
      .where(and(eq(projects.id, body.id), eq(projects.userId, userId)))
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
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt(request.nextUrl.searchParams.get("id") || "", 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Valid project ID is required" }, { status: 400 });
    }
    await db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, userId)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
