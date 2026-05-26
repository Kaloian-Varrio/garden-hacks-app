import "server-only";

import { and, asc, count, desc, eq } from "drizzle-orm";
import { db, gardeningHacks, groupMembers, groups } from "@/db";
import type { AuthUser } from "@/lib/auth/session";
import { isAdmin } from "./authorization";
import type {
  GroupHackItem,
  GroupFormValues,
  GroupMemberItem,
  LeaveGroupInfo,
  ManagedGroupMembers,
  UserGroupDetail,
  UserGroupListItem,
} from "./types";

export async function getUserGroups(
  user: AuthUser,
): Promise<UserGroupListItem[]> {
  if (isAdmin(user)) {
    const groupRows = await db.query.groups.findMany({
      orderBy: [desc(groups.createdAt)],
      columns: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        membersCount: true,
        hacksCount: true,
      },
    });

    return groupRows.map((group) => ({
      membershipId: group.id,
      groupId: group.id,
      title: group.title,
      description: group.description,
      imageUrl: group.imageUrl,
      groupRole: "admin",
      membersCount: group.membersCount,
      hacksCount: group.hacksCount,
      canManage: true,
    }));
  }

  const memberships = await db.query.groupMembers.findMany({
    where: eq(groupMembers.userId, user.id),
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
    canManage: membership.groupRole === "manager",
  }));
}

export async function getUserGroupDetail(
  user: AuthUser,
  groupId: number,
): Promise<UserGroupDetail | "not-found" | "access-denied"> {
  if (isAdmin(user)) {
    const group = await db.query.groups.findFirst({
      where: eq(groups.id, groupId),
      columns: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        membersCount: true,
        hacksCount: true,
      },
    });

    if (!group) {
      return "not-found";
    }

    const membership = await db.query.groupMembers.findFirst({
      where: and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, user.id)),
      columns: {
        id: true,
      },
    });

    return buildGroupDetail(group, user, "admin", Boolean(membership), true);
  }

  const membership = await db.query.groupMembers.findFirst({
    where: and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, user.id)),
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

  return buildGroupDetail(
    membership.group,
    user,
    membership.groupRole,
    true,
    membership.groupRole === "manager",
  );
}

export async function getEditableGroup(
  groupId: number,
): Promise<GroupFormValues | null> {
  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
    columns: {
      id: true,
      title: true,
      slug: true,
      description: true,
      imageUrl: true,
    },
  });

  return group
    ? {
        id: group.id,
        title: group.title,
        slug: group.slug,
        description: group.description ?? "",
        imageUrl: group.imageUrl ?? "",
      }
    : null;
}

export async function getLeaveGroupInfo(
  userId: number,
  groupId: number,
): Promise<LeaveGroupInfo | null> {
  const membership = await db.query.groupMembers.findFirst({
    where: and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)),
    columns: {
      id: true,
      groupRole: true,
    },
    with: {
      group: {
        columns: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!membership) {
    return null;
  }

  const [managerCountRow] = await db
    .select({ count: count() })
    .from(groupMembers)
    .where(
      and(
        eq(groupMembers.groupId, groupId),
        eq(groupMembers.groupRole, "manager"),
      ),
    );

  return {
    id: membership.group.id,
    title: membership.group.title,
    membershipId: membership.id,
    groupRole: membership.groupRole,
    managerCount: Number(managerCountRow?.count ?? 0),
  };
}

export async function getManagedGroupMembers(
  currentUserId: number,
  groupId: number,
): Promise<ManagedGroupMembers | null> {
  const group = await db.query.groups.findFirst({
    where: eq(groups.id, groupId),
    columns: {
      id: true,
      title: true,
      membersCount: true,
    },
  });

  if (!group) {
    return null;
  }

  const memberRows = await db.query.groupMembers.findMany({
    where: eq(groupMembers.groupId, groupId),
    orderBy: [asc(groupMembers.groupRole), asc(groupMembers.joinedAt)],
    columns: {
      id: true,
      groupRole: true,
      joinedAt: true,
      userId: true,
    },
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  const managerCount = memberRows.filter(
    (member) => member.groupRole === "manager",
  ).length;

  return {
    id: group.id,
    title: group.title,
    membersCount: group.membersCount,
    managerCount,
    members: memberRows.map((member) => ({
      membershipId: member.id,
      userId: member.userId,
      name: member.user.name,
      email: member.user.email,
      groupRole: member.groupRole,
      joinedAt: member.joinedAt,
      isCurrentUser: member.userId === currentUserId,
    })),
  };
}

async function buildGroupDetail(
  group: {
    id: number;
    title: string;
    description: string | null;
    imageUrl: string | null;
    membersCount: number;
    hacksCount: number;
  },
  user: AuthUser,
  viewerRole: "member" | "manager" | "admin",
  viewerIsMember: boolean,
  canManage: boolean,
): Promise<UserGroupDetail> {
  const [memberRows, hackRows] = await Promise.all([
    db.query.groupMembers.findMany({
      where: eq(groupMembers.groupId, group.id),
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
      where: eq(gardeningHacks.groupId, group.id),
      orderBy: [desc(gardeningHacks.createdAt)],
      columns: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        authorId: true,
        difficulty: true,
        status: true,
        sweetTomatoesCount: true,
        bitterCucumbersCount: true,
        ratingScore: true,
        commentsCount: true,
        createdAt: true,
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
    authorId: hack.authorId,
    author: hack.author.name,
    category: hack.category.title,
    difficulty: hack.difficulty,
    status: hack.status,
    sweetTomatoesCount: hack.sweetTomatoesCount,
    bitterCucumbersCount: hack.bitterCucumbersCount,
    ratingScore: hack.ratingScore,
    commentsCount: hack.commentsCount,
    createdAt: hack.createdAt,
    canManage: isAdmin(user) || canManage || hack.authorId === user.id,
  }));

  return {
    id: group.id,
    title: group.title,
    description: group.description,
    imageUrl: group.imageUrl,
    membersCount: group.membersCount,
    hacksCount: group.hacksCount,
    viewerRole,
    viewerIsMember,
    canManage,
    managers: members.filter((member) => member.groupRole === "manager"),
    members,
    hacks,
  };
}
