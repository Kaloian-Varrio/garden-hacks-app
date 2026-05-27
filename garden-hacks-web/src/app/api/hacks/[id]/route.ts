import { NextResponse } from "next/server";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import {
  categories,
  db,
  gardeningHacks,
  hackComments,
  groupMembers,
  groups,
  userPointsLog,
  users,
} from "@/db";
import { getCurrentUser } from "@/lib/auth/session";
import { getOptionalApiUser } from "@/lib/api/http";
import { createUniqueHackSlug } from "@/lib/dashboard/slug";
import { parseHackPayload } from "@/lib/dashboard/validation";
import { getHackImageUrl } from "@/lib/garden-assets";

const PUBLISHED_HACK_POINTS = 10;

type HackRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getOwnedHack(userId: number, hackId: number) {
  return db.query.gardeningHacks.findFirst({
    where: and(eq(gardeningHacks.id, hackId), eq(gardeningHacks.authorId, userId)),
  });
}

export async function GET(request: Request, { params }: HackRouteContext) {
  const { id } = await params;
  const hackId = Number(id);

  if (!Number.isInteger(hackId) || hackId <= 0) {
    return NextResponse.json({ error: "Invalid hack id." }, { status: 400 });
  }

  const url = new URL(request.url);
  const commentsOrder = url.searchParams.get("commentsOrder") === "oldest" ? "oldest" : "newest";
  const viewer = await getOptionalApiUser(request);
  const hack = await db.query.gardeningHacks.findFirst({
    where: and(eq(gardeningHacks.id, hackId), eq(gardeningHacks.status, "published")),
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
      comments: {
        orderBy: commentsOrder === "oldest" ? [asc(hackComments.createdAt)] : [desc(hackComments.createdAt)],
        limit: 50,
        columns: {
          id: true,
          text: true,
          createdAt: true,
          updatedAt: true,
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

  if (!hack) {
    return NextResponse.json({ error: "Hack not found." }, { status: 404 });
  }

  const [like, saved, vote] = viewer
    ? await Promise.all([
        db.query.hackLikes.findFirst({
          where: (row, { and: all, eq: equals }) =>
            all(equals(row.hackId, hackId), equals(row.userId, viewer.id)),
          columns: { id: true },
        }),
        db.query.savedHacks.findFirst({
          where: (row, { and: all, eq: equals }) =>
            all(equals(row.hackId, hackId), equals(row.userId, viewer.id)),
          columns: { id: true },
        }),
        db.query.hackVotes.findFirst({
          where: (row, { and: all, eq: equals }) =>
            all(equals(row.hackId, hackId), equals(row.userId, viewer.id)),
          columns: { voteType: true },
        }),
      ])
    : [null, null, null];

  return NextResponse.json({
    hack: {
      ...hack,
      imageUrl: getHackImageUrl({ imageUrl: hack.imageUrl, slug: hack.slug }),
      comments: hack.comments.map((comment) => ({
        id: comment.id,
        text: comment.text,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author: comment.user,
      })),
      isLiked: Boolean(like),
      isSaved: Boolean(saved),
      userVote: vote?.voteType ?? null,
    },
  });
}

export async function PUT(request: Request, { params }: HackRouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const hackId = Number(id);

  if (!Number.isInteger(hackId) || hackId <= 0) {
    return NextResponse.json({ error: "Invalid hack id." }, { status: 400 });
  }

  const existingHack = await getOwnedHack(user.id, hackId);

  if (!existingHack) {
    return NextResponse.json({ error: "Hack not found." }, { status: 404 });
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

    const publishPointsNeeded =
      payload.status === "published" && existingHack.pointsAwarded === 0;
    const pointsAwarded = publishPointsNeeded
      ? PUBLISHED_HACK_POINTS
      : existingHack.pointsAwarded;

    const [updatedHack] = await db
      .update(gardeningHacks)
      .set({
        ...payload,
        slug: await createUniqueHackSlug(payload.title, hackId),
        pointsAwarded,
        updatedAt: new Date(),
      })
      .where(and(eq(gardeningHacks.id, hackId), eq(gardeningHacks.authorId, user.id)))
      .returning();

    const wasPublished = existingHack.status === "published";
    const isPublished = payload.status === "published";

    if (existingHack.groupId !== payload.groupId) {
      const countUpdates = [];

      if (wasPublished) {
        countUpdates.push(
          db
            .update(groups)
            .set({
              hacksCount: sql<number>`greatest(${groups.hacksCount} - 1, 0)`,
              updatedAt: new Date(),
            })
            .where(eq(groups.id, existingHack.groupId)),
        );
      }

      if (isPublished) {
        countUpdates.push(
          db
            .update(groups)
            .set({
              hacksCount: sql<number>`${groups.hacksCount} + 1`,
              updatedAt: new Date(),
            })
            .where(eq(groups.id, payload.groupId)),
        );
      }

      await Promise.all(countUpdates);
    } else if (!wasPublished && isPublished) {
      await db
        .update(groups)
        .set({
          hacksCount: sql<number>`${groups.hacksCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(groups.id, payload.groupId));
    } else if (wasPublished && !isPublished) {
      await db
        .update(groups)
        .set({
          hacksCount: sql<number>`greatest(${groups.hacksCount} - 1, 0)`,
          updatedAt: new Date(),
        })
        .where(eq(groups.id, payload.groupId));
    }

    if (publishPointsNeeded) {
      await db.insert(userPointsLog).values({
        userId: user.id,
        hackId,
        points: PUBLISHED_HACK_POINTS,
        reason: "published_hack",
      });
      await db
        .update(users)
        .set({
          pointsBalance: sql<number>`${users.pointsBalance} + ${PUBLISHED_HACK_POINTS}`,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));
    }

    return NextResponse.json({ hack: updatedHack });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid hack data." },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: HackRouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const hackId = Number(id);

  if (!Number.isInteger(hackId) || hackId <= 0) {
    return NextResponse.json({ error: "Invalid hack id." }, { status: 400 });
  }

  const existingHack = await getOwnedHack(user.id, hackId);

  if (!existingHack) {
    return NextResponse.json({ error: "Hack not found." }, { status: 404 });
  }

  await db
    .delete(gardeningHacks)
    .where(and(eq(gardeningHacks.id, hackId), eq(gardeningHacks.authorId, user.id)));

  if (existingHack.status === "published") {
    await db
      .update(groups)
      .set({
        hacksCount: sql<number>`greatest(${groups.hacksCount} - 1, 0)`,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, existingHack.groupId));
  }

  return NextResponse.json({ success: true });
}
