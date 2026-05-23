import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db, groupMembers, groups } from "@/db";
import { getCurrentUser } from "@/lib/auth/session";

type LeaveGroupRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: Request, { params }: LeaveGroupRouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Login is required to leave groups." }, { status: 401 });
  }

  const { id } = await params;
  const groupId = Number(id);

  if (!Number.isInteger(groupId) || groupId <= 0) {
    return NextResponse.json({ error: "Invalid group id." }, { status: 400 });
  }

  const membership = await db.query.groupMembers.findFirst({
    where: and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, user.id)),
    columns: {
      id: true,
      groupRole: true,
    },
  });

  if (!membership) {
    return NextResponse.json({ error: "Membership not found." }, { status: 404 });
  }

  if (membership.groupRole === "manager") {
    return NextResponse.json(
      { error: "Group managers cannot leave from this flow." },
      { status: 400 },
    );
  }

  await db.delete(groupMembers).where(eq(groupMembers.id, membership.id));
  await db
    .update(groups)
    .set({
      membersCount: sql<number>`greatest(${groups.membersCount} - 1, 0)`,
      updatedAt: new Date(),
    })
    .where(eq(groups.id, groupId));

  return NextResponse.json({ success: true });
}
