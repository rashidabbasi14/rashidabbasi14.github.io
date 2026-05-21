import { NextResponse } from "next/server";
import { getCertifications } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getCertifications();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch certifications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
