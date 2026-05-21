import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { education } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/admin/education
export async function GET() {
  try {
    const data = await db.select().from(education).orderBy(education.sortOrder);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch education:", error);
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

// POST /api/admin/education — Create
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [created] = await db
      .insert(education)
      .values({
        degree: body.degree,
        institution: body.institution,
        year: body.year,
        sortOrder: body.sortOrder || 0,
      })
      .returning();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Failed to create education:", error);
    return NextResponse.json({ error: "Failed to create education" }, { status: 500 });
  }
}

// PUT /api/admin/education — Update
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Education ID is required" }, { status: 400 });
    }
    const [updated] = await db
      .update(education)
      .set({
        degree: body.degree,
        institution: body.institution,
        year: body.year,
        sortOrder: body.sortOrder ?? 0,
      })
      .where(eq(education.id, body.id))
      .returning();
    if (!updated) {
      return NextResponse.json({ error: "Education not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update education:", error);
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
  }
}

// DELETE /api/admin/education?id=X
export async function DELETE(request: NextRequest) {
  try {
    const id = parseInt(request.nextUrl.searchParams.get("id") || "", 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Valid education ID is required" }, { status: 400 });
    }
    await db.delete(education).where(eq(education.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete education:", error);
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
  }
}
