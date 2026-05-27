import { NextResponse } from "next/server";
import { count, desc } from "drizzle-orm";
import { db, groups } from "@/db";
import { getOptionalApiUser, getPagination } from "@/lib/api/http";
import { getGroupImageUrl } from "@/lib/garden-assets";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { page, pageSize, offset } = getPagination(url.searchParams);
  const viewer = await getOptionalApiUser(request);

  const [rows, totalRows] = await Promise.all([
    db
      .select({
        id: groups.id,
        title: groups.title,
        slug: groups.slug,
        description: groups.description,
        imageUrl: groups.imageUrl,
        membersCount: groups.membersCount,
        hacksCount: groups.hacksCount,
      })
      .from(groups)
      .orderBy(desc(groups.membersCount), desc(groups.hacksCount), desc(groups.createdAt))
      .limit(pageSize)
      .offset(offset),
    db.select({ count: count() }).from(groups),
  ]);

  const joinedGroupIds = new Set<number>();

  if (viewer && rows.length > 0) {
    const memberships = await db.query.groupMembers.findMany({
      where: (membership, { and, eq, inArray: inValues }) =>
        and(
          eq(membership.userId, viewer.id),
          inValues(membership.groupId, rows.map((group) => group.id)),
        ),
      columns: {
        groupId: true,
      },
    });

    memberships.forEach((membership) => joinedGroupIds.add(membership.groupId));
  }

  return NextResponse.json({
    groups: rows.map((group) => ({
      ...group,
      imageUrl: getGroupImageUrl({ imageUrl: group.imageUrl, slug: group.slug }),
      isJoined: joinedGroupIds.has(group.id),
    })),
    pagination: {
      page,
      pageSize,
      total: Number(totalRows[0]?.count ?? 0),
    },
  });
}
