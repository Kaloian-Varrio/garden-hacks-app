import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db, gardeningHacks, hackComments } from "@/db";
import {
  parseIdParam,
  readJsonBody,
  requireApiUser,
  validationError,
  type RouteContext,
} from "@/lib/api/http";
import { readStringField } from "@/lib/auth/validation";

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
  const text = readStringField(body, "text");

  if (!text) {
    return validationError({
      text: "Comment text is required.",
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

  const [comment] = await db
    .insert(hackComments)
    .values({
      hackId,
      userId: user.id,
      text,
    })
    .returning({
      id: hackComments.id,
      text: hackComments.text,
      createdAt: hackComments.createdAt,
      updatedAt: hackComments.updatedAt,
    });

  await db
    .update(gardeningHacks)
    .set({
      commentsCount: sql<number>`${gardeningHacks.commentsCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(gardeningHacks.id, hackId));

  return NextResponse.json(
    {
      comment: {
        ...comment,
        author: {
          id: user.id,
          name: user.name,
          photoUrl: user.photoUrl,
        },
      },
    },
    { status: 201 },
  );
}

