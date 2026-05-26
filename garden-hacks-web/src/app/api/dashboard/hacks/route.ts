import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardHacks } from "@/lib/dashboard/queries";
import { getPagination } from "@/lib/api/http";

export async function GET(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const { page, pageSize } = getPagination(url.searchParams);
  const result = await getDashboardHacks(user.id, { page, pageSize });

  return NextResponse.json(result);
}
