import { NextResponse } from "next/server";
import { getSkillCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getSkillCategories();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
