import { NextResponse } from "next/server";
import { and, count, eq, sql } from "drizzle-orm";
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
    const [managerCountRow] = await db
      .select({ count: count() })
      .from(groupMembers)
      .where(
        and(
          eq(groupMembers.groupId, groupId),
          eq(groupMembers.groupRole, "manager"),
        ),
      );

    if (Number(managerCountRow?.count ?? 0) <= 1) {
      return NextResponse.json(
        {
          error:
            "You cannot leave this group because you are the only group manager.",
        },
        { status: 400 },
      );
    }
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
