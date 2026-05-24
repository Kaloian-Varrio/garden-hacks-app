import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db, gardeningHacks, groupMembers, groups } from "@/db";
import { getOptionalApiUser, parseIdParam, type RouteContext } from "@/lib/api/http";

export async function GET(request: Request, { params }: RouteContext) {
  const groupId = await parseIdParam(params);

  if (!groupId) {
    return NextResponse.json({ error: "Invalid group id." }, { status: 400 });
  }

  const viewer = await getOptionalApiUser(request);
  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
    columns: {
      id: true,
      title: true,
      slug: true,
      description: true,
      imageUrl: true,
      membersCount: true,
      hacksCount: true,
    },
    with: {
      members: {
        where: eq(groupMembers.groupRole, "manager"),
        columns: {
          id: true,
          groupRole: true,
        },
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              photoUrl: true,
            },
          },
        },
      },
    },
  });

  if (!group) {
    return NextResponse.json({ error: "Group not found." }, { status: 404 });
  }

  const [recentHacks, viewerMembership] = await Promise.all([
    db.query.gardeningHacks.findMany({
      where: and(
        eq(gardeningHacks.groupId, groupId),
        eq(gardeningHacks.status, "published"),
      ),
      orderBy: [desc(gardeningHacks.createdAt)],
      limit: 6,
      columns: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        imageUrl: true,
        difficulty: true,
        likesCount: true,
        commentsCount: true,
        sweetTomatoesCount: true,
        bitterCucumbersCount: true,
        ratingScore: true,
        createdAt: true,
      },
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            photoUrl: true,
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
    viewer
      ? db.query.groupMembers.findFirst({
          where: and(
            eq(groupMembers.groupId, groupId),
            eq(groupMembers.userId, viewer.id),
          ),
          columns: {
            id: true,
            groupRole: true,
          },
        })
      : Promise.resolve(null),
  ]);

  const { members, ...groupFields } = group;

  return NextResponse.json({
    group: {
      ...groupFields,
      managers: members.map((membership) => membership.user),
      recentHacks,
      isJoined: Boolean(viewerMembership),
    },
  });
}
