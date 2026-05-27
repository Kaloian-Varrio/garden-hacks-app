import { NextResponse } from "next/server";
import { and, count, desc, eq } from "drizzle-orm";
import { db, gardeningHacks, groupMembers, savedHacks, userPointsLog } from "@/db";
import { requireApiUser } from "@/lib/api/http";
import { getGroupImageUrl, getHackImageUrl } from "@/lib/garden-assets";

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
    savedHackItems,
    recentActivity,
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
    db.query.savedHacks.findMany({
      where: eq(savedHacks.userId, user.id),
      orderBy: [desc(savedHacks.createdAt)],
      limit: 5,
      columns: {
        id: true,
        createdAt: true,
      },
      with: {
        hack: {
          columns: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            imageUrl: true,
            ratingScore: true,
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
        },
      },
    }),
    db.query.userPointsLog.findMany({
      where: eq(userPointsLog.userId, user.id),
      orderBy: [desc(userPointsLog.createdAt)],
      limit: 5,
      columns: {
        id: true,
        reason: true,
        points: true,
        createdAt: true,
      },
      with: {
        hack: {
          columns: {
            title: true,
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
    recentUserHacks: recentUserHacks.map((hack) => ({
      ...hack,
      imageUrl: getHackImageUrl({ imageUrl: hack.imageUrl, slug: hack.slug }),
    })),
    recentActivity: recentActivity.map((item) => ({
      id: item.id,
      reason: item.reason,
      points: item.points,
      hackTitle: item.hack?.title ?? null,
      createdAt: item.createdAt,
    })),
    savedHacks: savedHackItems.map((item) => ({
      id: item.id,
      savedAt: item.createdAt,
      hack: {
        ...item.hack,
        imageUrl: getHackImageUrl({
          imageUrl: item.hack.imageUrl,
          slug: item.hack.slug,
        }),
      },
    })),
    joinedGroups: joinedGroups.map((membership) => ({
      membershipId: membership.id,
      groupRole: membership.groupRole,
      joinedAt: membership.joinedAt,
      ...membership.group,
      imageUrl: getGroupImageUrl({
        imageUrl: membership.group.imageUrl,
        slug: membership.group.slug,
      }),
    })),
  });
}
