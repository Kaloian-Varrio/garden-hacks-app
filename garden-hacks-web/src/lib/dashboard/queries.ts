import "server-only";

import { and, count, desc, eq } from "drizzle-orm";
import {
  categories,
  db,
  gardeningHacks,
  groupMembers,
  groups,
  savedHacks,
  userPointsLog,
  users,
} from "@/db";
import type {
  DashboardActivityItem,
  DashboardGroupItem,
  DashboardHackPage,
  DashboardHackFormValues,
  DashboardSavedHackItem,
  SelectOption,
} from "./types";

const DEFAULT_DASHBOARD_HACKS_PAGE = 1;
const DEFAULT_DASHBOARD_HACKS_PAGE_SIZE = 10;
const MAX_DASHBOARD_HACKS_PAGE_SIZE = 50;

async function countRows<T extends number>(query: Promise<Array<{ count: T }>>) {
  const [row] = await query;
  return Number(row?.count ?? 0);
}

export async function getDashboardOverview(userId: number) {
  const [user, publishedHacks, joinedGroups, savedCount, recentActivity] =
    await Promise.all([
      db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
          id: true,
          email: true,
          name: true,
          photoUrl: true,
          pointsBalance: true,
          role: true,
        },
      }),
      countRows(
        db
          .select({ count: count() })
          .from(gardeningHacks)
          .where(
            and(
              eq(gardeningHacks.authorId, userId),
              eq(gardeningHacks.status, "published"),
            ),
          ),
      ),
      countRows(
        db
          .select({ count: count() })
          .from(groupMembers)
          .where(eq(groupMembers.userId, userId)),
      ),
      countRows(
        db
          .select({ count: count() })
          .from(savedHacks)
          .where(eq(savedHacks.userId, userId)),
      ),
      getRecentActivity(userId),
    ]);

  if (!user) {
    return null;
  }

  return {
    user,
    stats: {
      publishedHacks,
      joinedGroups,
      savedHacks: savedCount,
      pointsBalance: user.pointsBalance,
    },
    recentActivity,
  };
}

export async function getRecentActivity(
  userId: number,
  limit = 8,
): Promise<DashboardActivityItem[]> {
  const rows = await db.query.userPointsLog.findMany({
    where: eq(userPointsLog.userId, userId),
    orderBy: [desc(userPointsLog.createdAt)],
    limit,
    with: {
      hack: {
        columns: {
          title: true,
        },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    reason: row.reason,
    points: row.points,
    hackTitle: row.hack?.title ?? null,
    createdAt: row.createdAt,
  }));
}

export async function getDashboardHacks(
  userId: number,
  options: {
    page?: number;
    pageSize?: number;
  } = {},
): Promise<DashboardHackPage> {
  const requestedPage =
    Number.isInteger(options.page) && options.page && options.page > 0
      ? options.page
      : DEFAULT_DASHBOARD_HACKS_PAGE;
  const requestedPageSize =
    Number.isInteger(options.pageSize) &&
    options.pageSize &&
    options.pageSize > 0
      ? options.pageSize
      : DEFAULT_DASHBOARD_HACKS_PAGE_SIZE;
  const pageSize = Math.min(
    requestedPageSize,
    MAX_DASHBOARD_HACKS_PAGE_SIZE,
  );
  const totalItems = await countRows(
    db
      .select({ count: count() })
      .from(gardeningHacks)
      .where(eq(gardeningHacks.authorId, userId)),
  );
  const totalPages = Math.ceil(totalItems / pageSize);
  const currentPage = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;

  const rows = await db.query.gardeningHacks.findMany({
    where: eq(gardeningHacks.authorId, userId),
    orderBy: [desc(gardeningHacks.createdAt)],
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    with: {
      group: {
        columns: {
          title: true,
        },
      },
      category: {
        columns: {
          title: true,
        },
      },
    },
  });

  return {
    hacks: rows.map((hack) => ({
      id: hack.id,
      title: hack.title,
      slug: hack.slug,
      status: hack.status,
      group: hack.group.title,
      category: hack.category.title,
      sweetTomatoesCount: hack.sweetTomatoesCount,
      bitterCucumbersCount: hack.bitterCucumbersCount,
      ratingScore: hack.ratingScore,
      commentsCount: hack.commentsCount,
      createdAt: hack.createdAt,
    })),
    currentPage,
    pageSize,
    totalItems,
    totalPages,
  };
}

export async function getDashboardSavedHacks(
  userId: number,
): Promise<DashboardSavedHackItem[]> {
  const rows = await db.query.savedHacks.findMany({
    where: eq(savedHacks.userId, userId),
    orderBy: [desc(savedHacks.createdAt)],
    with: {
      hack: {
        columns: {
          title: true,
          slug: true,
          ratingScore: true,
        },
        with: {
          group: {
            columns: {
              title: true,
            },
          },
          category: {
            columns: {
              title: true,
            },
          },
        },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    savedAt: row.createdAt,
    hack: {
      title: row.hack.title,
      slug: row.hack.slug,
      group: row.hack.group.title,
      category: row.hack.category.title,
      ratingScore: row.hack.ratingScore,
    },
  }));
}

export async function getDashboardGroups(
  userId: number,
): Promise<DashboardGroupItem[]> {
  const rows = await db.query.groupMembers.findMany({
    where: eq(groupMembers.userId, userId),
    orderBy: [desc(groupMembers.joinedAt)],
    with: {
      group: {
        columns: {
          id: true,
          title: true,
          slug: true,
          description: true,
          membersCount: true,
          hacksCount: true,
        },
      },
    },
  });

  return rows.map((membership) => ({
    membershipId: membership.id,
    groupId: membership.group.id,
    title: membership.group.title,
    slug: membership.group.slug,
    description: membership.group.description,
    groupRole: membership.groupRole,
    membersCount: membership.group.membersCount,
    hacksCount: membership.group.hacksCount,
  }));
}

export async function getHackFormOptions(): Promise<{
  groups: SelectOption[];
  categories: SelectOption[];
}> {
  const [groupRows, categoryRows] = await Promise.all([
    db.select({ id: groups.id, title: groups.title }).from(groups),
    db.select({ id: categories.id, title: categories.title }).from(categories),
  ]);

  return {
    groups: groupRows,
    categories: categoryRows,
  };
}

export async function getEditableHack(userId: number, hackId: number) {
  const hack = await db.query.gardeningHacks.findFirst({
    where: and(eq(gardeningHacks.id, hackId), eq(gardeningHacks.authorId, userId)),
    columns: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      sourceUrl: true,
      groupId: true,
      categoryId: true,
      difficulty: true,
      isOrganic: true,
      isChemicalFree: true,
      status: true,
    },
  });

  return hack
    ? {
        ...hack,
        excerpt: hack.excerpt ?? "",
        imageUrl: hack.imageUrl ?? "",
        sourceUrl: hack.sourceUrl ?? "",
      }
    : null;
}

export async function getHackFormInitialValues(
  userId: number,
  hackId: number,
): Promise<(DashboardHackFormValues & { id: number }) | null> {
  const hack = await getEditableHack(userId, hackId);

  return hack;
}
