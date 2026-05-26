import { NextResponse } from "next/server";
import { and, count, eq, sql } from "drizzle-orm";
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

  const updatedGroup = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
    columns: {
      id: true,
      membersCount: true,
    },
  });

  return NextResponse.json({
    success: true,
    isJoined: false,
    membersCount: updatedGroup?.membersCount ?? null,
  });
}
