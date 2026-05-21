import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { profiles, users } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/admin/profile
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    // Also fetch the user record to get the current username
    const [user] = await db
      .select({ username: users.username })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return NextResponse.json({
      profile: profile || null,
      username: user?.username ?? null,
    });
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

/**
 * Ensure a user record exists in the `users` table for the given Clerk userId.
 * This is a fallback for when the Clerk webhook hasn't been configured yet.
 */
async function ensureUserRecord(userId: string) {
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!existing) {
    // Use a temporary placeholder — the user will set these during onboarding
    await db.insert(users).values({
      id: userId,
      username: `user_${userId.slice(0, 8)}`,
      email: `${userId.slice(0, 8)}@placeholder.com`,
    });
  }
}

// POST /api/admin/profile — Create or Update (upsert) + username update
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Ensure the user record exists before inserting profile (FK constraint)
    await ensureUserRecord(userId);

    const body = await request.json();

    // ─── Username validation & update ──────────────────────────────────
    if (body.username && typeof body.username === "string") {
      const trimmed = body.username.trim().toLowerCase();

      // Validate format: alphanumeric, hyphens, underscores, 3-100 chars
      if (!/^[a-z0-9_-]{3,100}$/.test(trimmed)) {
        return NextResponse.json(
          { error: "Username must be 3-100 characters and can only contain letters, numbers, hyphens, and underscores." },
          { status: 400 }
        );
      }

      // Check uniqueness (exclude current user)
      const [existingUser] = await db
        .select({ id: users.id })
        .from(users)
        .where(and(eq(users.username, trimmed), ne(users.id, userId)))
        .limit(1);

      if (existingUser) {
        return NextResponse.json(
          { error: "This username is already taken. Please choose another one." },
          { status: 409 }
        );
      }

      // Update username
      await db
        .update(users)
        .set({ username: trimmed })
        .where(eq(users.id, userId));
    }

    // ─── Profile upsert ────────────────────────────────────────────────
    const [existing] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (existing) {
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
          isPrivate: body.isPrivate ?? false,
          updatedAt: new Date(),
        })
        .where(and(eq(profiles.id, existing.id), eq(profiles.userId, userId)))
        .returning();
      return NextResponse.json(updated);
    } else {
      const [created] = await db
        .insert(profiles)
        .values({
          userId,
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
          isPrivate: body.isPrivate ?? false,
        })
        .returning();
      return NextResponse.json(created, { status: 201 });
    }
  } catch (error) {
    console.error("Failed to save profile:", error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
