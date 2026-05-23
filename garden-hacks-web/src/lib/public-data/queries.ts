import { and, desc, eq } from "drizzle-orm";
import { fallbackGroups, fallbackHacks } from "./fallback";
import type {
  PublicGroup,
  PublicGroupDetail,
  PublicHack,
  PublicHackComment,
} from "./types";

const canUseDatabase = () => Boolean(process.env.DATABASE_URL);

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
      imageUrl: group.imageUrl,
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
      imageUrl: group.imageUrl,
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
        imageUrl: hack.imageUrl,
        category: hack.category.title,
        group: hack.group.title,
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

export async function getPublicHacks(limit?: number): Promise<PublicHack[]> {
  if (!canUseDatabase()) {
    return limit ? fallbackHacks.slice(0, limit) : fallbackHacks;
  }

  try {
    const { categories, db, gardeningHacks, groups, users } = await import(
      "@/db"
    );
    const rows = await db.query.gardeningHacks.findMany({
      where: eq(gardeningHacks.status, "published"),
      orderBy: [desc(gardeningHacks.ratingScore), desc(gardeningHacks.createdAt)],
      limit,
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
            title: true,
            slug: true,
          },
        },
      },
    });

    void categories;
    void groups;
    void users;

    return rows.map((hack) => ({
      id: hack.id,
      title: hack.title,
      slug: hack.slug,
      excerpt: hack.excerpt,
      content: hack.content,
      imageUrl: hack.imageUrl,
      category: hack.category.title,
      group: hack.group.title,
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
    }));
  } catch {
    return limit ? fallbackHacks.slice(0, limit) : fallbackHacks;
  }
}

export async function getPublicHackBySlug(
  slug: string,
): Promise<PublicHack | null> {
  if (!canUseDatabase()) {
    return fallbackHacks.find((hack) => hack.slug === slug) ?? null;
  }

  try {
    const { db, gardeningHacks } = await import("@/db");
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
            title: true,
            slug: true,
          },
        },
        comments: {
          limit: 4,
          orderBy: (comments, { desc: descending }) => [
            descending(comments.createdAt),
          ],
          with: {
            user: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!hack || hack.status !== "published") {
      return null;
    }

    const comments: PublicHackComment[] = hack.comments.map((comment) => ({
      id: comment.id,
      author: comment.user.name,
      text: comment.text,
    }));

    return {
      id: hack.id,
      title: hack.title,
      slug: hack.slug,
      excerpt: hack.excerpt,
      content: hack.content,
      imageUrl: hack.imageUrl,
      category: hack.category.title,
      group: hack.group.title,
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
    };
  } catch {
    return fallbackHacks.find((hack) => hack.slug === slug) ?? null;
  }
}

export async function getFilterOptions() {
  const [groups, hacks] = await Promise.all([getPublicGroups(), getPublicHacks()]);
  const categories = [...new Set(hacks.map((hack) => hack.category))].sort();

  return {
    categories,
    groups: groups.map((group) => group.title),
    difficulties: ["easy", "medium", "hard"],
    ratings: ["Highest rated", "Most sweet tomatoes", "Most discussed"],
  };
}
