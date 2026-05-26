import { NextResponse } from "next/server";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db, gardeningHacks, groupMembers, hackComments } from "@/db";
import {
  getOptionalApiUser,
  parseIdParam,
  readJsonBody,
  requireApiUser,
  validationError,
  type RouteContext,
} from "@/lib/api/http";
import { readStringField } from "@/lib/auth/validation";

export async function GET(request: Request, { params }: RouteContext) {
  const hackId = await parseIdParam(params);

  if (!hackId) {
    return NextResponse.json({ error: "Invalid hack id." }, { status: 400 });
  }

  const url = new URL(request.url);
  const commentsOrder =
    url.searchParams.get("commentsOrder") === "oldest" ? "oldest" : "newest";
  const viewer = await getOptionalApiUser(request);
  const hack = await db.query.gardeningHacks.findFirst({
    where: and(eq(gardeningHacks.id, hackId), eq(gardeningHacks.status, "published")),
    columns: {
      id: true,
      groupId: true,
    },
    with: {
      comments: {
        orderBy:
          commentsOrder === "oldest"
            ? [asc(hackComments.createdAt)]
            : [desc(hackComments.createdAt)],
        limit: 50,
        columns: {
          id: true,
          userId: true,
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

  const managerMembership =
    viewer && viewer.role !== "admin"
      ? await db.query.groupMembers.findFirst({
          where: and(
            eq(groupMembers.groupId, hack.groupId),
            eq(groupMembers.userId, viewer.id),
            eq(groupMembers.groupRole, "manager"),
          ),
          columns: {
            id: true,
          },
        })
      : null;

  return NextResponse.json({
    comments: hack.comments.map((comment) => ({
      id: comment.id,
      text: comment.text,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: comment.user,
      canEdit: Boolean(viewer && (viewer.role === "admin" || viewer.id === comment.userId)),
      canDelete: Boolean(
        viewer &&
          (viewer.role === "admin" ||
            viewer.id === comment.userId ||
            managerMembership),
      ),
    })),
  });
}

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
