import { NextResponse } from "next/server";
import { and, count, desc, eq } from "drizzle-orm";
import { db, gardeningHacks, groupMembers, savedHacks } from "@/db";
import { requireApiUser } from "@/lib/api/http";

export async function GET(request: Request) {
  const { user, response } = await requireApiUser(request);

  if (!user) {
    return response;
  }

  const [
    publishedHacksRows,
    joinedGroupsRows,
    savedHacksRows,
    recentUserHacks,
    joinedGroups,
  ] = await Promise.all([
    db
      .select({ count: count() })
      .from(gardeningHacks)
      .where(
        and(
          eq(gardeningHacks.authorId, user.id),
          eq(gardeningHacks.status, "published"),
        ),
      ),
    db
      .select({ count: count() })
      .from(groupMembers)
      .where(eq(groupMembers.userId, user.id)),
    db
      .select({ count: count() })
      .from(savedHacks)
      .where(eq(savedHacks.userId, user.id)),
    db.query.gardeningHacks.findMany({
      where: eq(gardeningHacks.authorId, user.id),
      orderBy: [desc(gardeningHacks.createdAt)],
      limit: 5,
      columns: {
        id: true,
        title: true,
        slug: true,
        status: true,
        imageUrl: true,
        ratingScore: true,
        commentsCount: true,
        createdAt: true,
      },
      with: {
        group: {
          columns: {
            id: true,
            title: true,
            slug: true,
          },
        },
        category: {
          columns: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    }),
    db.query.groupMembers.findMany({
      where: eq(groupMembers.userId, user.id),
      orderBy: [desc(groupMembers.joinedAt)],
      limit: 5,
      columns: {
        id: true,
        groupRole: true,
        joinedAt: true,
      },
      with: {
        group: {
          columns: {
            id: true,
            title: true,
            slug: true,
            description: true,
            imageUrl: true,
            membersCount: true,
            hacksCount: true,
          },
        },
      },
    }),
  ]);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      photoUrl: user.photoUrl,
    },
    pointsBalance: user.pointsBalance,
    publishedHacksCount: Number(publishedHacksRows[0]?.count ?? 0),
    joinedGroupsCount: Number(joinedGroupsRows[0]?.count ?? 0),
    savedHacksCount: Number(savedHacksRows[0]?.count ?? 0),
    recentUserHacks,
    joinedGroups: joinedGroups.map((membership) => ({
      membershipId: membership.id,
      groupRole: membership.groupRole,
      joinedAt: membership.joinedAt,
      ...membership.group,
    })),
  });
}

