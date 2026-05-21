import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { username?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { username } = body;

  if (!username || typeof username !== "string") {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  const trimmed = username.trim().toLowerCase();

  // Validate username format
  if (!/^[a-z0-9_-]{3,30}$/.test(trimmed)) {
    return NextResponse.json(
      {
        error:
          "Username must be 3-30 characters and can only contain letters, numbers, hyphens, and underscores",
      },
      { status: 400 }
    );
  }

  try {
    // Check if username is already taken by another user
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, trimmed))
      .limit(1);

    if (existing.length > 0 && existing[0].id !== userId) {
      return NextResponse.json(
        { error: "This username is already taken" },
        { status: 409 }
      );
    }

    // Check if user record exists
    const userRecord = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userRecord.length === 0) {
      // User doesn't exist yet — create them (webhook might not have fired yet)
      // We need their email from Clerk
      const clerkUser = await fetch(
        `https://api.clerk.com/v1/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
        }
      );

      if (!clerkUser.ok) {
        return NextResponse.json(
          { error: "Failed to fetch user details" },
          { status: 500 }
        );
      }

      const clerkData = await clerkUser.json();
      const email =
        clerkData.email_addresses?.[0]?.email_address || "unknown@email.com";

      await db.insert(users).values({
        id: userId,
        username: trimmed,
        email,
      });
    } else {
      // Update existing user's username
      await db
        .update(users)
        .set({ username: trimmed })
        .where(eq(users.id, userId));
    }

    return NextResponse.json({
      success: true,
      username: trimmed,
    });
  } catch (err) {
    console.error("Failed to setup user:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
