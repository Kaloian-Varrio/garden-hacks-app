import { NextResponse } from "next/server";
import { getPublicGroups } from "@/lib/public-data/queries";

export async function GET() {
  return NextResponse.json({ groups: await getPublicGroups() });
}
