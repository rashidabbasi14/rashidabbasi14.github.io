import { NextRequest, NextResponse } from "next/server";
import { getCertifications } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId query parameter is required" }, { status: 400 });
    }

    const data = await getCertifications(userId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch certifications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
