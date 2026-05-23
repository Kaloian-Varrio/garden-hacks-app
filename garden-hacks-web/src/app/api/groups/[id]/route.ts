import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, groups } from "@/db";

type GroupRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: GroupRouteContext) {
  const { id } = await params;
  const groupId = Number(id);

  if (!Number.isInteger(groupId) || groupId <= 0) {
    return NextResponse.json({ error: "Invalid group id." }, { status: 400 });
  }

  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
  });

  if (!group) {
    return NextResponse.json({ error: "Group not found." }, { status: 404 });
  }

  return NextResponse.json({ group });
}
