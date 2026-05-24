import { NextResponse } from "next/server";
import { and, count, eq } from "drizzle-orm";
import { db, gardeningHacks, hackVotes } from "@/db";
import {
  parseIdParam,
  readJsonBody,
  requireApiUser,
  validationError,
  type RouteContext,
} from "@/lib/api/http";
import { readStringField } from "@/lib/auth/validation";

const VOTE_TYPES = ["sweet_tomato", "bitter_cucumber"] as const;

export async function POST(request: Request, { params }: RouteContext) {
  const { user, response } = await requireApiUser(request);

  if (!user) {
    return response;
  }

  const hackId = await parseIdParam(params);

  if (!hackId) {
    return NextResponse.json({ error: "Invalid hack id." }, { status: 400 });
  }

  const body = await readJsonBody(request);
  const voteType = readStringField(body, "voteType");
  const feedbackText = readStringField(body, "feedbackText") || null;

  if (!VOTE_TYPES.includes(voteType as (typeof VOTE_TYPES)[number])) {
    return validationError({
      voteType: "Vote type must be sweet_tomato or bitter_cucumber.",
    });
  }

  const hack = await db.query.gardeningHacks.findFirst({
    where: and(eq(gardeningHacks.id, hackId), eq(gardeningHacks.status, "published")),
    columns: {
      id: true,
    },
  });

  if (!hack) {
    return NextResponse.json({ error: "Hack not found." }, { status: 404 });
  }

  const existingVote = await db.query.hackVotes.findFirst({
    where: and(eq(hackVotes.hackId, hackId), eq(hackVotes.userId, user.id)),
    columns: {
      id: true,
    },
  });

  if (existingVote) {
    await db
      .update(hackVotes)
      .set({
        voteType: voteType as (typeof VOTE_TYPES)[number],
        feedbackText,
        updatedAt: new Date(),
      })
      .where(eq(hackVotes.id, existingVote.id));
  } else {
    await db.insert(hackVotes).values({
      hackId,
      userId: user.id,
      voteType: voteType as (typeof VOTE_TYPES)[number],
      feedbackText,
    });
  }

  const [sweetRows, bitterRows] = await Promise.all([
    db
      .select({ count: count() })
      .from(hackVotes)
      .where(and(eq(hackVotes.hackId, hackId), eq(hackVotes.voteType, "sweet_tomato"))),
    db
      .select({ count: count() })
      .from(hackVotes)
      .where(and(eq(hackVotes.hackId, hackId), eq(hackVotes.voteType, "bitter_cucumber"))),
  ]);

  const sweetTomatoesCount = Number(sweetRows[0]?.count ?? 0);
  const bitterCucumbersCount = Number(bitterRows[0]?.count ?? 0);
  const ratingScore = sweetTomatoesCount - bitterCucumbersCount;

  await db
    .update(gardeningHacks)
    .set({
      sweetTomatoesCount,
      bitterCucumbersCount,
      ratingScore,
      updatedAt: new Date(),
    })
    .where(eq(gardeningHacks.id, hackId));

  return NextResponse.json({
    userVote: voteType,
    sweetTomatoesCount,
    bitterCucumbersCount,
    ratingScore,
  });
}
