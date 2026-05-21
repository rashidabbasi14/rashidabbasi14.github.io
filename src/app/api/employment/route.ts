import { NextResponse } from "next/server";
import { getEmployment } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getEmployment();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch employment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
