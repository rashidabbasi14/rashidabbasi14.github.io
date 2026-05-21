import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/admin/profile
export async function GET() {
  try {
    const data = await db.select().from(profiles).limit(1);
    return NextResponse.json(data[0] || null);
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// POST /api/admin/profile — Create or Update (upsert)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const existing = await db.select().from(profiles).limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(profiles)
        .set({
          name: body.name,
          title: body.title,
          tagline: body.tagline,
          description: body.description,
          aboutMe: body.aboutMe,
          footerAboutMe: body.footerAboutMe,
          image: body.image,
          email: body.email,
          phone: body.phone || null,
          location: body.location || null,
          social: body.social,
          updatedAt: new Date(),
        })
        .where(eq(profiles.id, existing[0].id))
        .returning();
      return NextResponse.json(updated);
    } else {
      const [created] = await db
        .insert(profiles)
        .values({
          name: body.name,
          title: body.title,
          tagline: body.tagline,
          description: body.description,
          aboutMe: body.aboutMe,
          footerAboutMe: body.footerAboutMe,
          image: body.image,
          email: body.email,
          phone: body.phone || null,
          location: body.location || null,
          social: body.social,
        })
        .returning();
      return NextResponse.json(created, { status: 201 });
    }
  } catch (error) {
    console.error("Failed to save profile:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
