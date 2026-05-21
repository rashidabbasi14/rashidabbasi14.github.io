import { NextRequest, NextResponse } from "next/server";
import { getProfile, getUserByUsername } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const username = searchParams.get("username");

    // Resolve userId from username if provided
    let resolvedUserId = userId;
    if (!resolvedUserId && username) {
      const user = await getUserByUsername(username);
      if (user) {
        resolvedUserId = user.id;
      }
    }

    if (!resolvedUserId) {
      return NextResponse.json({ error: "userId or username query parameter is required" }, { status: 400 });
    }

    const profile = await getProfile(resolvedUserId);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
