import "server-only";

import { and, asc, desc, eq } from "drizzle-orm";
import { db, gardeningHacks, groupMembers, groups } from "@/db";
import type {
  GroupHackItem,
  GroupMemberItem,
  UserGroupDetail,
  UserGroupListItem,
} from "./types";

export async function getUserGroups(
  userId: number,
): Promise<UserGroupListItem[]> {
  const memberships = await db.query.groupMembers.findMany({
    where: eq(groupMembers.userId, userId),
    orderBy: [desc(groupMembers.joinedAt)],
    columns: {
      id: true,
      groupRole: true,
    },
    with: {
      group: {
        columns: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          membersCount: true,
          hacksCount: true,
        },
      },
    },
  });

  return memberships.map((membership) => ({
    membershipId: membership.id,
    groupId: membership.group.id,
    title: membership.group.title,
    description: membership.group.description,
    imageUrl: membership.group.imageUrl,
    groupRole: membership.groupRole,
    membersCount: membership.group.membersCount,
    hacksCount: membership.group.hacksCount,
  }));
}

export async function getUserGroupDetail(
  userId: number,
  groupId: number,
): Promise<UserGroupDetail | "not-found" | "access-denied"> {
  const membership = await db.query.groupMembers.findFirst({
    where: and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)),
    columns: {
      groupRole: true,
    },
    with: {
      group: {
        columns: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          membersCount: true,
          hacksCount: true,
        },
      },
    },
  });

  if (!membership) {
    const group = await db.query.groups.findFirst({
      where: eq(groups.id, groupId),
      columns: {
        id: true,
      },
    });

    return group ? "access-denied" : "not-found";
  }

  const [memberRows, hackRows] = await Promise.all([
    db.query.groupMembers.findMany({
      where: eq(groupMembers.groupId, groupId),
      orderBy: [asc(groupMembers.groupRole), asc(groupMembers.joinedAt)],
      columns: {
        groupRole: true,
        joinedAt: true,
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
    }),
    db.query.gardeningHacks.findMany({
      where: and(
        eq(gardeningHacks.groupId, groupId),
        eq(gardeningHacks.status, "published"),
      ),
      orderBy: [desc(gardeningHacks.createdAt)],
      columns: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        difficulty: true,
        sweetTomatoesCount: true,
        bitterCucumbersCount: true,
        ratingScore: true,
        commentsCount: true,
      },
      with: {
        author: {
          columns: {
            name: true,
          },
        },
        category: {
          columns: {
            title: true,
          },
        },
      },
    }),
  ]);

  const members: GroupMemberItem[] = memberRows.map((row) => ({
    id: row.user.id,
    name: row.user.name,
    photoUrl: row.user.photoUrl,
    groupRole: row.groupRole,
    joinedAt: row.joinedAt,
  }));
  const hacks: GroupHackItem[] = hackRows.map((hack) => ({
    id: hack.id,
    title: hack.title,
    slug: hack.slug,
    excerpt: hack.excerpt,
    author: hack.author.name,
    category: hack.category.title,
    difficulty: hack.difficulty,
    sweetTomatoesCount: hack.sweetTomatoesCount,
    bitterCucumbersCount: hack.bitterCucumbersCount,
    ratingScore: hack.ratingScore,
    commentsCount: hack.commentsCount,
  }));

  return {
    id: membership.group.id,
    title: membership.group.title,
    description: membership.group.description,
    imageUrl: membership.group.imageUrl,
    membersCount: membership.group.membersCount,
    hacksCount: membership.group.hacksCount,
    viewerRole: membership.groupRole,
    managers: members.filter((member) => member.groupRole === "manager"),
    members,
    hacks,
  };
}
