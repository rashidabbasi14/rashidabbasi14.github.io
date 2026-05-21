import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { certifications } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/admin/certifications
export async function GET() {
  try {
    const data = await db.select().from(certifications).orderBy(certifications.sortOrder);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch certifications:", error);
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 });
  }
}

// POST /api/admin/certifications — Create
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [created] = await db
      .insert(certifications)
      .values({
        title: body.title,
        subtitle: body.subtitle || null,
        description: body.description || null,
        image: body.image || null,
        url: body.url || null,
        tags: body.tags || null,
        sortOrder: body.sortOrder || 0,
      })
      .returning();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Failed to create certification:", error);
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
  }
}

// PUT /api/admin/certifications — Update
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Certification ID is required" }, { status: 400 });
    }
    const [updated] = await db
      .update(certifications)
      .set({
        title: body.title,
        subtitle: body.subtitle ?? null,
        description: body.description ?? null,
        image: body.image ?? null,
        url: body.url ?? null,
        tags: body.tags ?? null,
        sortOrder: body.sortOrder ?? 0,
      })
      .where(eq(certifications.id, body.id))
      .returning();
    if (!updated) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update certification:", error);
    return NextResponse.json({ error: "Failed to update certification" }, { status: 500 });
  }
}

// DELETE /api/admin/certifications?id=X
export async function DELETE(request: NextRequest) {
  try {
    const id = parseInt(request.nextUrl.searchParams.get("id") || "", 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Valid certification ID is required" }, { status: 400 });
    }
    await db.delete(certifications).where(eq(certifications.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete certification:", error);
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
  }
}
