import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { employment } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/admin/employment
export async function GET() {
  try {
    const data = await db.select().from(employment).orderBy(employment.sortOrder);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch employment:", error);
    return NextResponse.json({ error: "Failed to fetch employment" }, { status: 500 });
  }
}

// POST /api/admin/employment — Create
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [created] = await db
      .insert(employment)
      .values({
        title: body.title,
        company: body.company,
        duration: body.duration || null,
        description: body.description || null,
        image: body.image || null,
        isCurrent: body.isCurrent || false,
        sortOrder: body.sortOrder || 0,
      })
      .returning();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Failed to create employment:", error);
    return NextResponse.json({ error: "Failed to create employment" }, { status: 500 });
  }
}

// PUT /api/admin/employment — Update
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Employment ID is required" }, { status: 400 });
    }
    const [updated] = await db
      .update(employment)
      .set({
        title: body.title,
        company: body.company,
        duration: body.duration ?? null,
        description: body.description ?? null,
        image: body.image ?? null,
        isCurrent: body.isCurrent ?? false,
        sortOrder: body.sortOrder ?? 0,
      })
      .where(eq(employment.id, body.id))
      .returning();
    if (!updated) {
      return NextResponse.json({ error: "Employment not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update employment:", error);
    return NextResponse.json({ error: "Failed to update employment" }, { status: 500 });
  }
}

// DELETE /api/admin/employment?id=X
export async function DELETE(request: NextRequest) {
  try {
    const id = parseInt(request.nextUrl.searchParams.get("id") || "", 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Valid employment ID is required" }, { status: 400 });
    }
    await db.delete(employment).where(eq(employment.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete employment:", error);
    return NextResponse.json({ error: "Failed to delete employment" }, { status: 500 });
  }
}
