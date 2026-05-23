import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardOverview } from "@/lib/dashboard/queries";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const overview = await getDashboardOverview(user.id);

  return NextResponse.json({ overview });
}
