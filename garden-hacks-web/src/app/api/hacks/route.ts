import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import {
  categories,
  db,
  gardeningHacks,
  groups,
  userPointsLog,
  users,
} from "@/db";
import { getCurrentUser } from "@/lib/auth/session";
import { createUniqueHackSlug } from "@/lib/dashboard/slug";
import { parseHackPayload } from "@/lib/dashboard/validation";

const PUBLISHED_HACK_POINTS = 10;

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
