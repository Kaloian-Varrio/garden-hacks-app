import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, gardeningHacks, savedHacks } from "@/db";
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

  const existingSavedHack = await db.query.savedHacks.findFirst({
    where: and(eq(savedHacks.hackId, hackId), eq(savedHacks.userId, user.id)),
    columns: {
      id: true,
    },
  });

  if (existingSavedHack) {
    await db.delete(savedHacks).where(eq(savedHacks.id, existingSavedHack.id));
  } else {
    await db.insert(savedHacks).values({
      hackId,
      userId: user.id,
    });
  }

  return NextResponse.json({
    isSaved: !existingSavedHack,
  });
}

