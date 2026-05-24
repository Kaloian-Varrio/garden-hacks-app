import { NextResponse } from "next/server";
import { and, count, desc, eq, sql } from "drizzle-orm";
import {
  categories,
  db,
  gardeningHacks,
  groupMembers,
  groups,
  userPointsLog,
  users,
} from "@/db";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getOptionalApiUser,
  getPagination,
  parsePositiveInteger,
} from "@/lib/api/http";
import { createUniqueHackSlug } from "@/lib/dashboard/slug";
import { parseHackPayload } from "@/lib/dashboard/validation";

const PUBLISHED_HACK_POINTS = 10;
const DIFFICULTIES = ["easy", "medium", "hard"] as const;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { page, pageSize, offset } = getPagination(url.searchParams);
  const viewer = await getOptionalApiUser(request);
  const groupId = parsePositiveInteger(url.searchParams.get("groupId"));
  const categoryId = parsePositiveInteger(url.searchParams.get("categoryId"));
  const difficulty = url.searchParams.get("difficulty");
  const sort = url.searchParams.get("sort") ?? "newest";

  const filters = [eq(gardeningHacks.status, "published")];

  if (groupId) {
    filters.push(eq(gardeningHacks.groupId, groupId));
  }

  if (categoryId) {
    filters.push(eq(gardeningHacks.categoryId, categoryId));
  }

  if (difficulty && DIFFICULTIES.includes(difficulty as (typeof DIFFICULTIES)[number])) {
    filters.push(eq(gardeningHacks.difficulty, difficulty as (typeof DIFFICULTIES)[number]));
  }

  const orderBy =
    sort === "top"
      ? [desc(gardeningHacks.ratingScore), desc(gardeningHacks.createdAt)]
      : sort === "most_liked"
        ? [desc(gardeningHacks.likesCount), desc(gardeningHacks.createdAt)]
        : [desc(gardeningHacks.createdAt)];

  const where = and(...filters);
  const [rows, totalRows] = await Promise.all([
    db.query.gardeningHacks.findMany({
      where,
      orderBy,
      limit: pageSize,
      offset,
      columns: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        imageUrl: true,
        difficulty: true,
        isOrganic: true,
        isChemicalFree: true,
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
    db.select({ count: count() }).from(gardeningHacks).where(where),
  ]);

  const hackIds = rows.map((hack) => hack.id);
  const likedHackIds = new Set<number>();
  const savedHackIds = new Set<number>();
  const votesByHackId = new Map<number, "sweet_tomato" | "bitter_cucumber">();

  if (viewer && hackIds.length > 0) {
    const [likes, saves, votes] = await Promise.all([
      db.query.hackLikes.findMany({
        where: (like, { and: all, eq: equals, inArray: inValues }) =>
          all(equals(like.userId, viewer.id), inValues(like.hackId, hackIds)),
        columns: { hackId: true },
      }),
      db.query.savedHacks.findMany({
        where: (saved, { and: all, eq: equals, inArray: inValues }) =>
          all(equals(saved.userId, viewer.id), inValues(saved.hackId, hackIds)),
        columns: { hackId: true },
      }),
      db.query.hackVotes.findMany({
        where: (vote, { and: all, eq: equals, inArray: inValues }) =>
          all(equals(vote.userId, viewer.id), inValues(vote.hackId, hackIds)),
        columns: { hackId: true, voteType: true },
      }),
    ]);

    likes.forEach((like) => likedHackIds.add(like.hackId));
    saves.forEach((saved) => savedHackIds.add(saved.hackId));
    votes.forEach((vote) => votesByHackId.set(vote.hackId, vote.voteType));
  }

  return NextResponse.json({
    hacks: rows.map((hack) => ({
      ...hack,
      isLiked: likedHackIds.has(hack.id),
      isSaved: savedHackIds.has(hack.id),
      userVote: votesByHackId.get(hack.id) ?? null,
    })),
    pagination: {
      page,
      pageSize,
      total: Number(totalRows[0]?.count ?? 0),
    },
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  try {
    const payload = parseHackPayload(body);
    const [group, category] = await Promise.all([
      db.query.groups.findFirst({
        where: eq(groups.id, payload.groupId),
        columns: { id: true },
      }),
      db.query.categories.findFirst({
        where: eq(categories.id, payload.categoryId),
        columns: { id: true },
      }),
    ]);

    if (!group) {
      return NextResponse.json({ error: "Selected group does not exist." }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: "Selected category does not exist." }, { status: 400 });
    }

    if (payload.status === "published" && user.role !== "admin") {
      const membership = await db.query.groupMembers.findFirst({
        where: and(
          eq(groupMembers.groupId, payload.groupId),
          eq(groupMembers.userId, user.id),
        ),
        columns: { id: true },
      });

      if (!membership) {
        return NextResponse.json(
          { error: "Join this group before publishing a hack inside it." },
          { status: 403 },
        );
      }
    }

    const pointsAwarded =
      payload.status === "published" ? PUBLISHED_HACK_POINTS : 0;
    const [hack] = await db
      .insert(gardeningHacks)
      .values({
        ...payload,
        slug: await createUniqueHackSlug(payload.title),
        authorId: user.id,
        pointsAwarded,
      })
      .returning();

    if (payload.status === "published") {
      await db
        .update(groups)
        .set({
          hacksCount: sql<number>`${groups.hacksCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(groups.id, payload.groupId));
    }

    if (pointsAwarded > 0) {
      await db.insert(userPointsLog).values({
        userId: user.id,
        hackId: hack.id,
        points: pointsAwarded,
        reason: "published_hack",
      });
      await db
        .update(users)
        .set({
          pointsBalance: sql<number>`${users.pointsBalance} + ${pointsAwarded}`,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));
    }

    return NextResponse.json({ hack }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid hack data." },
      { status: 400 },
    );
  }
}
