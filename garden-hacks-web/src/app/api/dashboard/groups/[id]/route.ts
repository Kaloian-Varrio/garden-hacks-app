import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db, groupMembers, groups } from "@/db";
import { getCurrentUser } from "@/lib/auth/session";

type GroupRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, { params }: GroupRouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const groupId = Number(id);

  if (!Number.isInteger(groupId) || groupId <= 0) {
    return NextResponse.json({ error: "Invalid group id." }, { status: 400 });
  }

  const deleted = await db
    .delete(groupMembers)
    .where(and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, user.id)))
    .returning({ id: groupMembers.id });

  if (deleted.length === 0) {
    return NextResponse.json({ error: "Membership not found." }, { status: 404 });
  }

  await db
    .update(groups)
    .set({
      membersCount: sql<number>`greatest(${groups.membersCount} - 1, 0)`,
      updatedAt: new Date(),
    })
    .where(eq(groups.id, groupId));

  return NextResponse.json({ success: true });
}
