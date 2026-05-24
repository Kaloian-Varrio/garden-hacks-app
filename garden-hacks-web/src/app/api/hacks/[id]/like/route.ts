import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db, gardeningHacks, hackLikes } from "@/db";
import { parseIdParam, requireApiUser, type RouteContext } from "@/lib/api/http";

export async function POST(request: Request, { params }: RouteContext) {
  const { user, response } = await requireApiUser(request);

  if (!user) {
    return response;
  }

  const hackId = await parseIdParam(params);

  if (!hackId) {
    return NextResponse.json({ error: "Invalid hack id." }, { status: 400 });
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

  const existingLike = await db.query.hackLikes.findFirst({
    where: and(eq(hackLikes.hackId, hackId), eq(hackLikes.userId, user.id)),
    columns: {
      id: true,
    },
  });

  if (existingLike) {
    await db.delete(hackLikes).where(eq(hackLikes.id, existingLike.id));
    await db
      .update(gardeningHacks)
      .set({
        likesCount: sql<number>`greatest(${gardeningHacks.likesCount} - 1, 0)`,
        updatedAt: new Date(),
      })
      .where(eq(gardeningHacks.id, hackId));
  } else {
    await db.insert(hackLikes).values({
      hackId,
      userId: user.id,
    });
    await db
      .update(gardeningHacks)
      .set({
        likesCount: sql<number>`${gardeningHacks.likesCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(gardeningHacks.id, hackId));
  }

  const updatedHack = await db.query.gardeningHacks.findFirst({
    where: eq(gardeningHacks.id, hackId),
    columns: {
      likesCount: true,
    },
  });

  return NextResponse.json({
    isLiked: !existingLike,
    likesCount: updatedHack?.likesCount ?? 0,
  });
}

