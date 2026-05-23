import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db, gardeningHacks } from "@/db";

type GroupHacksRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: GroupHacksRouteContext) {
  const { id } = await params;
  const groupId = Number(id);

  if (!Number.isInteger(groupId) || groupId <= 0) {
    return NextResponse.json({ error: "Invalid group id." }, { status: 400 });
  }

  const hacks = await db.query.gardeningHacks.findMany({
    where: and(
      eq(gardeningHacks.groupId, groupId),
      eq(gardeningHacks.status, "published"),
    ),
    orderBy: [desc(gardeningHacks.ratingScore), desc(gardeningHacks.createdAt)],
    with: {
      author: { columns: { name: true } },
      category: { columns: { title: true } },
    },
  });

  return NextResponse.json({ hacks });
}
