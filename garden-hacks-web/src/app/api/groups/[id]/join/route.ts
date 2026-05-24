import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db, groupMembers, groups } from "@/db";
import { parseIdParam, requireApiUser, type RouteContext } from "@/lib/api/http";

export async function POST(request: Request, { params }: RouteContext) {
  const { user, response } = await requireApiUser(request);

  if (!user) {
    return response;
  }

  const groupId = await parseIdParam(params);

  if (!groupId) {
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

  const updatedGroup = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
    columns: {
      id: true,
      membersCount: true,
    },
  });

  return NextResponse.json(
    {
      success: true,
      isJoined: true,
      membership,
      membersCount: updatedGroup?.membersCount ?? null,
    },
    { status: 201 },
  );
}
