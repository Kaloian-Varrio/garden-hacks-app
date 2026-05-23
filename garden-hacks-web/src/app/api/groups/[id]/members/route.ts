import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, groupMembers } from "@/db";

type GroupMembersRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: GroupMembersRouteContext,
) {
  const { id } = await params;
  const groupId = Number(id);

  if (!Number.isInteger(groupId) || groupId <= 0) {
    return NextResponse.json({ error: "Invalid group id." }, { status: 400 });
  }

  const members = await db.query.groupMembers.findMany({
    where: eq(groupMembers.groupId, groupId),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          photoUrl: true,
        },
      },
    },
  });

  return NextResponse.json({
    members: members.map((membership) => ({
      id: membership.id,
      groupRole: membership.groupRole,
      joinedAt: membership.joinedAt,
      user: membership.user,
    })),
  });
}
