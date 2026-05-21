import { NextResponse } from "next/server";
import { getEducation } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getEducation();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch education:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
