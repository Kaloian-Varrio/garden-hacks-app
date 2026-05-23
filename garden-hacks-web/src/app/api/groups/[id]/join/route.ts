import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db, groupMembers, groups } from "@/db";
import { getCurrentUser } from "@/lib/auth/session";

type JoinGroupRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: Request, { params }: JoinGroupRouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Login is required to join groups." }, { status: 401 });
  }

  const { id } = await params;
  const groupId = Number(id);

  if (!Number.isInteger(groupId) || groupId <= 0) {
    return NextResponse.json({ error: "Invalid group id." }, { status: 400 });
  }

  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
    columns: { id: true },
  });

  if (!group) {
    return NextResponse.json({ error: "Group not found." }, { status: 404 });
  }

  const existingMembership = await db.query.groupMembers.findFirst({
    where: and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, user.id)),
    columns: { id: true },
  });

  if (existingMembership) {
    return NextResponse.json(
      { error: "You are already a member of this group." },
      { status: 409 },
    );
  }

  const [membership] = await db
    .insert(groupMembers)
    .values({
      groupId,
      userId: user.id,
      groupRole: "member",
    })
    .returning();

  await db
    .update(groups)
    .set({
      membersCount: sql<number>`${groups.membersCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(groups.id, groupId));

  return NextResponse.json({ membership }, { status: 201 });
}
