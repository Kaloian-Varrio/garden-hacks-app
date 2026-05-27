import { and, count, desc, eq } from "drizzle-orm";
import type { AuthUser } from "@/lib/auth/session";
import { getGroupImageUrl, getHackImageUrl } from "@/lib/garden-assets";
import { fallbackGroups, fallbackHacks } from "./fallback";
import type {
  PublicGroup,
  PublicGroupDetail,
  PublicHack,
  PublicHackComment,
  PublicHackPage,
} from "./types";

const canUseDatabase = () => Boolean(process.env.DATABASE_URL);
const DEFAULT_PUBLIC_HACKS_PAGE = 1;
const DEFAULT_PUBLIC_HACKS_PAGE_SIZE = 10;
const MAX_PUBLIC_HACKS_PAGE_SIZE = 50;

export async function getPublicGroups(limit?: number): Promise<PublicGroup[]> {
  if (!canUseDatabase()) {
    return limit ? fallbackGroups.slice(0, limit) : fallbackGroups;
  }

  try {
    const { db, groups } = await import("@/db");
    const rows = await db
      .select()
      .from(groups)
      .orderBy(desc(groups.membersCount), desc(groups.hacksCount));

    return (limit ? rows.slice(0, limit) : rows).map((group) => ({
      id: group.id,
      title: group.title,
      slug: group.slug,
      description: group.description,
      imageUrl: getGroupImageUrl({ imageUrl: group.imageUrl, slug: group.slug }),
      membersCount: group.membersCount,
      hacksCount: group.hacksCount,
    }));
  } catch {
    return limit ? fallbackGroups.slice(0, limit) : fallbackGroups;
  }
}

export async function getPublicGroupBySlug(
  slug: string,
  viewerUserId?: number,
): Promise<PublicGroupDetail | null> {
  if (!canUseDatabase()) {
    const group = fallbackGroups.find((item) => item.slug === slug);

    if (!group) {
      return null;
    }

    return {
      ...group,
      managers: [],
      hacks: fallbackHacks.filter((hack) => hack.groupSlug === group.slug),
      viewerMembership: null,
    };
  }

  try {
    const { db, gardeningHacks, groupMembers, groups } = await import("@/db");
    const group = await db.query.groups.findFirst({
      where: eq(groups.slug, slug),
      with: {
        members: {
          where: eq(groupMembers.groupRole, "manager"),
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
      return null;
    }

    const [hacks, viewerMembership] = await Promise.all([
      db.query.gardeningHacks.findMany({
        where: and(
          eq(gardeningHacks.groupId, group.id),
          eq(gardeningHacks.status, "published"),
        ),
        orderBy: [
          desc(gardeningHacks.ratingScore),
          desc(gardeningHacks.createdAt),
        ],
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
          group: {
            columns: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      }),
      viewerUserId
        ? db.query.groupMembers.findFirst({
            where: and(
              eq(groupMembers.groupId, group.id),
              eq(groupMembers.userId, viewerUserId),
            ),
            columns: {
              id: true,
              groupRole: true,
            },
          })
        : Promise.resolve(null),
    ]);

    return {
      id: group.id,
      title: group.title,
      slug: group.slug,
      description: group.description,
      imageUrl: getGroupImageUrl({ imageUrl: group.imageUrl, slug: group.slug }),
      membersCount: group.membersCount,
      hacksCount: group.hacksCount,
      managers: group.members.map((membership) => ({
        id: membership.user.id,
        name: membership.user.name,
        photoUrl: membership.user.photoUrl,
      })),
      hacks: hacks.map((hack) => ({
        id: hack.id,
        title: hack.title,
        slug: hack.slug,
        excerpt: hack.excerpt,
        content: hack.content,
        imageUrl: getHackImageUrl({ imageUrl: hack.imageUrl, slug: hack.slug }),
        category: hack.category.title,
        group: hack.group.title,
        groupId: hack.groupId,
        groupSlug: hack.group.slug,
        author: hack.author.name,
        difficulty: hack.difficulty,
        isOrganic: hack.isOrganic,
        isChemicalFree: hack.isChemicalFree,
        sweetTomatoesCount: hack.sweetTomatoesCount,
        bitterCucumbersCount: hack.bitterCucumbersCount,
        ratingScore: hack.ratingScore,
        commentsCount: hack.commentsCount,
        comments: [],
        userVote: null,
        viewerGroupRole: null,
      })),
      viewerMembership: viewerMembership
        ? {
            id: viewerMembership.id,
            groupRole: viewerMembership.groupRole,
          }
        : null,
    };
  } catch {
    return null;
  }
}

export async function getPublicHacks(
  limit?: number,
  viewerUserId?: number,
): Promise<PublicHack[]> {
  const page = await getPublicHacksPage({
    page: DEFAULT_PUBLIC_HACKS_PAGE,
    pageSize: limit ?? MAX_PUBLIC_HACKS_PAGE_SIZE,
    viewerUserId,
  });

  return page.hacks;
}

export async function getPublicHacksPage(
  options: {
    page?: number;
    pageSize?: number;
    viewerUserId?: number;
  } = {},
): Promise<PublicHackPage> {
  const requestedPage =
    Number.isInteger(options.page) && options.page && options.page > 0
      ? options.page
      : DEFAULT_PUBLIC_HACKS_PAGE;
  const requestedPageSize =
    Number.isInteger(options.pageSize) &&
    options.pageSize &&
    options.pageSize > 0
      ? options.pageSize
      : DEFAULT_PUBLIC_HACKS_PAGE_SIZE;
  const pageSize = Math.min(requestedPageSize, MAX_PUBLIC_HACKS_PAGE_SIZE);

  if (!canUseDatabase()) {
    const totalItems = fallbackHacks.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const currentPage = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;
    const offset = (currentPage - 1) * pageSize;

    return {
      hacks: fallbackHacks.slice(offset, offset + pageSize),
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    };
  }

  try {
    const { db, gardeningHacks, hackVotes } = await import("@/db");
    const totalRows = await db
      .select({ count: count() })
      .from(gardeningHacks)
      .where(eq(gardeningHacks.status, "published"));
    const totalItems = Number(totalRows[0]?.count ?? 0);
    const totalPages = Math.ceil(totalItems / pageSize);
    const currentPage = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;

    const rows = await db.query.gardeningHacks.findMany({
      where: eq(gardeningHacks.status, "published"),
      orderBy: [desc(gardeningHacks.ratingScore), desc(gardeningHacks.createdAt)],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
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
        group: {
          columns: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    const hackIds = rows.map((hack) => hack.id);
    const votes = options.viewerUserId && hackIds.length > 0
      ? await db.query.hackVotes.findMany({
          where: (vote, { and: all, eq: equals, inArray: inValues }) =>
            all(
              equals(vote.userId, options.viewerUserId!),
              inValues(vote.hackId, hackIds),
            ),
          columns: {
            hackId: true,
            voteType: true,
          },
        })
      : [];
    const votesByHackId = new Map(
      votes.map((vote) => [vote.hackId, vote.voteType] as const),
    );

    return {
      hacks: rows.map((hack) => ({
        id: hack.id,
        title: hack.title,
        slug: hack.slug,
        excerpt: hack.excerpt,
        content: hack.content,
        imageUrl: getHackImageUrl({ imageUrl: hack.imageUrl, slug: hack.slug }),
        category: hack.category.title,
        group: hack.group.title,
        groupId: hack.group.id,
        groupSlug: hack.group.slug,
        author: hack.author.name,
        difficulty: hack.difficulty,
        isOrganic: hack.isOrganic,
        isChemicalFree: hack.isChemicalFree,
        sweetTomatoesCount: hack.sweetTomatoesCount,
        bitterCucumbersCount: hack.bitterCucumbersCount,
        ratingScore: hack.ratingScore,
        commentsCount: hack.commentsCount,
        comments: [],
        userVote: votesByHackId.get(hack.id) ?? null,
        viewerGroupRole: null,
      })),
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    };
  } catch {
    const totalItems = fallbackHacks.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const currentPage = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;
    const offset = (currentPage - 1) * pageSize;

    return {
      hacks: fallbackHacks.slice(offset, offset + pageSize),
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    };
  }
}

export async function getPublicHackBySlug(
  slug: string,
  viewer?: Pick<AuthUser, "id" | "role"> | number,
): Promise<PublicHack | null> {
  if (!canUseDatabase()) {
    return fallbackHacks.find((hack) => hack.slug === slug) ?? null;
  }

  try {
    const { db, gardeningHacks, groupMembers, hackVotes } = await import("@/db");
    const hack = await db.query.gardeningHacks.findFirst({
      where: eq(gardeningHacks.slug, slug),
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
        group: {
          columns: {
            id: true,
            title: true,
            slug: true,
          },
        },
        comments: {
          orderBy: (comments, { desc: descending }) => [
            descending(comments.createdAt),
          ],
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

    if (!hack) {
      return null;
    }

    const viewerUserId = typeof viewer === "number" ? viewer : viewer?.id;
    const viewerRole = typeof viewer === "number" ? "user" : viewer?.role;
    const [viewerMembership, viewerVote] = viewerUserId
      ? await Promise.all([
          db.query.groupMembers.findFirst({
            where: and(
              eq(groupMembers.groupId, hack.group.id),
              eq(groupMembers.userId, viewerUserId),
            ),
            columns: {
              groupRole: true,
            },
          }),
          db.query.hackVotes.findFirst({
            where: and(
              eq(hackVotes.hackId, hack.id),
              eq(hackVotes.userId, viewerUserId),
            ),
            columns: {
              voteType: true,
            },
          }),
        ])
      : [null, null];

    if (
      hack.status !== "published" &&
      viewerRole !== "admin" &&
      !viewerMembership
    ) {
      return null;
    }

    const comments: PublicHackComment[] = hack.comments.map((comment) => ({
      id: comment.id,
      authorId: comment.user.id,
      authorName: comment.user.name,
      authorPhotoUrl: comment.user.photoUrl,
      text: comment.text,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));

    return {
      id: hack.id,
      title: hack.title,
      slug: hack.slug,
      excerpt: hack.excerpt,
      content: hack.content,
      imageUrl: getHackImageUrl({ imageUrl: hack.imageUrl, slug: hack.slug }),
      category: hack.category.title,
      group: hack.group.title,
      groupId: hack.group.id,
      groupSlug: hack.group.slug,
      author: hack.author.name,
      difficulty: hack.difficulty,
      isOrganic: hack.isOrganic,
      isChemicalFree: hack.isChemicalFree,
      sweetTomatoesCount: hack.sweetTomatoesCount,
      bitterCucumbersCount: hack.bitterCucumbersCount,
      ratingScore: hack.ratingScore,
      commentsCount: hack.commentsCount,
      comments,
      userVote: viewerVote?.voteType ?? null,
      viewerGroupRole: viewerMembership?.groupRole ?? null,
    };
  } catch {
    return fallbackHacks.find((hack) => hack.slug === slug) ?? null;
  }
}

export async function getFilterOptions() {
  if (!canUseDatabase()) {
    const categories = [...new Set(fallbackHacks.map((hack) => hack.category))].sort();

    return {
      categories,
      groups: fallbackGroups.map((group) => group.title),
      difficulties: ["easy", "medium", "hard"],
      ratings: ["Highest rated", "Most sweet tomatoes", "Most discussed"],
    };
  }

  try {
    const { categories: categoryTable, db } = await import("@/db");
    const [groups, categoryRows] = await Promise.all([
      getPublicGroups(),
      db
        .select({ title: categoryTable.title })
        .from(categoryTable)
        .orderBy(categoryTable.title),
    ]);

    return {
      categories: categoryRows.map((category) => category.title),
      groups: groups.map((group) => group.title),
      difficulties: ["easy", "medium", "hard"],
      ratings: ["Highest rated", "Most sweet tomatoes", "Most discussed"],
    };
  } catch {
    const categories = [...new Set(fallbackHacks.map((hack) => hack.category))].sort();

    return {
      categories,
      groups: fallbackGroups.map((group) => group.title),
      difficulties: ["easy", "medium", "hard"],
      ratings: ["Highest rated", "Most sweet tomatoes", "Most discussed"],
    };
  }
}
