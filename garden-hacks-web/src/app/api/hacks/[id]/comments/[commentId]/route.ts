import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { db, gardeningHacks, groupMembers, hackComments } from "@/db";
import {
  readJsonBody,
  requireApiUser,
  validationError,
} from "@/lib/api/http";
import type { AuthUser } from "@/lib/auth/session";
import { readStringField } from "@/lib/auth/validation";

type CommentRouteContext = {
  params: Promise<{
    id: string;
    commentId: string;
  }>;
};

export async function PATCH(request: Request, { params }: CommentRouteContext) {
  const { user, response } = await requireApiUser(request);

  if (!user) {
    return response;
  }

  const ids = await parseParams(params);

  if (!ids) {
    return NextResponse.json({ error: "Invalid comment id." }, { status: 400 });
  }

  const body = await readJsonBody(request);
  const text = readStringField(body, "text");

  if (!text) {
    return validationError({
      text: "Comment text is required.",
    });
  }

  const comment = await getComment(ids.hackId, ids.commentId);

  if (!comment) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }

  if (!canEditComment(user, comment.userId)) {
    return NextResponse.json(
      { error: "You cannot edit this comment." },
      { status: 403 },
    );
  }

  const [updatedComment] = await db
    .update(hackComments)
    .set({
      text,
      updatedAt: new Date(),
    })
    .where(
      and(eq(hackComments.id, ids.commentId), eq(hackComments.hackId, ids.hackId)),
    )
    .returning({
      id: hackComments.id,
      text: hackComments.text,
      updatedAt: hackComments.updatedAt,
    });

  return NextResponse.json({ comment: updatedComment });
}

export async function DELETE(_request: Request, { params }: CommentRouteContext) {
  const { user, response } = await requireApiUser(_request);

  if (!user) {
    return response;
  }

  const ids = await parseParams(params);

  if (!ids) {
    return NextResponse.json({ error: "Invalid comment id." }, { status: 400 });
  }

  const comment = await getComment(ids.hackId, ids.commentId);

  if (!comment) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }

  if (!(await canDeleteComment(user, comment.userId, comment.hack.groupId))) {
    return NextResponse.json(
      { error: "You cannot delete this comment." },
      { status: 403 },
    );
  }

  await db
    .delete(hackComments)
    .where(
      and(eq(hackComments.id, ids.commentId), eq(hackComments.hackId, ids.hackId)),
    );

  await db
    .update(gardeningHacks)
    .set({
      commentsCount: sql<number>`greatest(${gardeningHacks.commentsCount} - 1, 0)`,
      updatedAt: new Date(),
    })
    .where(eq(gardeningHacks.id, ids.hackId));

  return NextResponse.json({ success: true });
}

async function parseParams(params: CommentRouteContext["params"]) {
  const { id, commentId } = await params;
  const hackId = Number(id);
  const parsedCommentId = Number(commentId);

  if (
    !Number.isInteger(hackId) ||
    hackId <= 0 ||
    !Number.isInteger(parsedCommentId) ||
    parsedCommentId <= 0
  ) {
    return null;
  }

  return {
    hackId,
    commentId: parsedCommentId,
  };
}

async function getComment(hackId: number, commentId: number) {
  const comment = await db.query.hackComments.findFirst({
    where: and(eq(hackComments.id, commentId), eq(hackComments.hackId, hackId)),
    columns: {
      id: true,
      userId: true,
    },
    with: {
      hack: {
        columns: {
          groupId: true,
          status: true,
        },
      },
    },
  });

  return comment?.hack.status === "published" ? comment : null;
}

function canEditComment(user: AuthUser, authorId: number) {
  return user.role === "admin" || user.id === authorId;
}

async function canDeleteComment(
  user: AuthUser,
  authorId: number,
  groupId: number,
) {
  if (user.role === "admin" || user.id === authorId) {
    return true;
  }

  const membership = await db.query.groupMembers.findFirst({
    where: and(
      eq(groupMembers.groupId, groupId),
      eq(groupMembers.userId, user.id),
      eq(groupMembers.groupRole, "manager"),
    ),
    columns: {
      id: true,
    },
  });

  return Boolean(membership);
}
