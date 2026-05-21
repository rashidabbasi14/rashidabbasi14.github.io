import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { skillCategories, skills } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/admin/skills
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await db
      .select()
      .from(skillCategories)
      .where(eq(skillCategories.userId, userId))
      .orderBy(skillCategories.sortOrder);
    const result = [];
    for (const cat of categories) {
      const items = await db
        .select()
        .from(skills)
        .where(and(eq(skills.categoryId, cat.id), eq(skills.userId, userId)))
        .orderBy(skills.sortOrder);
      result.push({ ...cat, items });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

// POST /api/admin/skills — Create a skill category or a skill
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (body.type === "category") {
      const [created] = await db
        .insert(skillCategories)
        .values({ userId, name: body.name, sortOrder: body.sortOrder || 0 })
        .returning();
      return NextResponse.json(created, { status: 201 });
    } else {
      const [created] = await db
        .insert(skills)
        .values({
          userId,
          categoryId: body.categoryId,
          name: body.name,
          image: body.image || "",
          sortOrder: body.sortOrder || 0,
        })
        .returning();
      return NextResponse.json(created, { status: 201 });
    }
  } catch (error) {
    console.error("Failed to create skill:", error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}

// PUT /api/admin/skills — Update
export async function PUT(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (body.type === "category") {
      if (!body.id) return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
      const [updated] = await db
        .update(skillCategories)
        .set({ name: body.name, sortOrder: body.sortOrder ?? 0 })
        .where(and(eq(skillCategories.id, body.id), eq(skillCategories.userId, userId)))
        .returning();
      return NextResponse.json(updated);
    } else {
      if (!body.id) return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
      const [updated] = await db
        .update(skills)
        .set({
          categoryId: body.categoryId,
          name: body.name,
          image: body.image ?? "",
          sortOrder: body.sortOrder ?? 0,
        })
        .where(and(eq(skills.id, body.id), eq(skills.userId, userId)))
        .returning();
      return NextResponse.json(updated);
    }
  } catch (error) {
    console.error("Failed to update skill:", error);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

// DELETE /api/admin/skills?id=X&type=skill|category
export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt(request.nextUrl.searchParams.get("id") || "", 10);
    const type = request.nextUrl.searchParams.get("type") || "skill";
    if (isNaN(id)) {
      return NextResponse.json({ error: "Valid ID is required" }, { status: 400 });
    }
    if (type === "category") {
      await db.delete(skillCategories).where(and(eq(skillCategories.id, id), eq(skillCategories.userId, userId)));
    } else {
      await db.delete(skills).where(and(eq(skills.id, id), eq(skills.userId, userId)));
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete skill:", error);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
