"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
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
import { isGroupManager, isGroupMember } from "@/lib/groups/authorization";
import type { GroupHackActionState, GroupHackFormValues } from "./types";

const PUBLISHED_HACK_POINTS = 10;
const difficulties = ["easy", "medium", "hard"] as const;
const statuses = ["draft", "published", "archived"] as const;

export async function createGroupHackAction(
  groupId: number,
  _previousState: GroupHackActionState,
  formData: FormData,
): Promise<GroupHackActionState> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const canCreate = await isGroupMember(user.id, groupId);

  if (!canCreate) {
    return {
      errors: {
        form: "Join this group before creating a hack inside it.",
      },
      values: readHackFormValues(formData),
    };
  }

  const parsed = await parseHackForm(formData);

  if (!parsed.ok) {
    return parsed.state;
  }

  const pointsAwarded =
    parsed.values.status === "published" ? PUBLISHED_HACK_POINTS : 0;
  const [hack] = await db
    .insert(gardeningHacks)
    .values({
      ...parsed.values,
      groupId,
      authorId: user.id,
      slug: await createUniqueHackSlug(parsed.values.title),
      pointsAwarded,
    })
    .returning({ id: gardeningHacks.id });

  if (parsed.values.status === "published") {
    await db
      .update(groups)
      .set({
        hacksCount: sql<number>`${groups.hacksCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, groupId));
  }

  if (pointsAwarded > 0) {
    await awardPublishingPoints(user.id, hack.id);
  }

  revalidatePath(`/groups/${groupId}`);
  revalidatePath("/hacks");
  redirect(`/groups/${groupId}`);
}

export async function updateGroupHackAction(
  groupId: number,
  hackId: number,
  _previousState: GroupHackActionState,
  formData: FormData,
): Promise<GroupHackActionState> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const existingHack = await db.query.gardeningHacks.findFirst({
    where: and(eq(gardeningHacks.id, hackId), eq(gardeningHacks.groupId, groupId)),
    columns: {
      id: true,
      title: true,
      authorId: true,
      status: true,
      pointsAwarded: true,
    },
  });

  if (!existingHack) {
    return {
      errors: {
        form: "Hack not found.",
      },
      values: readHackFormValues(formData),
    };
  }

  const canManage =
    user.role === "admin" ||
    existingHack.authorId === user.id ||
    (await isGroupManager(user.id, groupId));

  if (!canManage) {
    return {
      errors: {
        form: "Only the author, group managers, and admins can edit this hack.",
      },
      values: readHackFormValues(formData),
    };
  }

  const parsed = await parseHackForm(formData);

  if (!parsed.ok) {
    return parsed.state;
  }

  const publishPointsNeeded =
    parsed.values.status === "published" && existingHack.pointsAwarded === 0;
  const pointsAwarded = publishPointsNeeded
    ? PUBLISHED_HACK_POINTS
    : existingHack.pointsAwarded;

  await db
    .update(gardeningHacks)
    .set({
      ...parsed.values,
      groupId,
      slug: await createUniqueHackSlug(parsed.values.title, hackId),
      pointsAwarded,
      updatedAt: new Date(),
    })
    .where(and(eq(gardeningHacks.id, hackId), eq(gardeningHacks.groupId, groupId)));

  await updatePublishedHackCount(
    groupId,
    existingHack.status,
    parsed.values.status,
  );

  if (publishPointsNeeded) {
    await awardPublishingPoints(existingHack.authorId, hackId);
  }

  revalidatePath(`/groups/${groupId}`);
  revalidatePath(`/hacks/${await createUniqueHackSlug(parsed.values.title, hackId)}`);
  redirect(`/groups/${groupId}`);
}

export async function deleteGroupHackAction(groupId: number, hackId: number) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const existingHack = await db.query.gardeningHacks.findFirst({
    where: and(eq(gardeningHacks.id, hackId), eq(gardeningHacks.groupId, groupId)),
    columns: {
      id: true,
      authorId: true,
      status: true,
    },
  });

  if (!existingHack) {
    redirect(`/groups/${groupId}`);
  }

  const canManage =
    user.role === "admin" ||
    existingHack.authorId === user.id ||
    (await isGroupManager(user.id, groupId));

  if (!canManage) {
    redirect(`/groups/${groupId}`);
  }

  await db
    .delete(gardeningHacks)
    .where(and(eq(gardeningHacks.id, hackId), eq(gardeningHacks.groupId, groupId)));

  if (existingHack.status === "published") {
    await db
      .update(groups)
      .set({
        hacksCount: sql<number>`greatest(${groups.hacksCount} - 1, 0)`,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, groupId));
  }

  revalidatePath(`/groups/${groupId}`);
  revalidatePath("/hacks");
  redirect(`/groups/${groupId}`);
}

async function parseHackForm(formData: FormData) {
  const values = readHackFormValues(formData);
  const errors: GroupHackActionState["errors"] = {};

  if (!values.title) {
    errors.title = "Title is required.";
  }

  if (!values.content) {
    errors.content = "Content is required.";
  }

  if (!values.categoryId) {
    errors.categoryId = "Category is required.";
  } else {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, values.categoryId),
      columns: {
        id: true,
      },
    });

    if (!category) {
      errors.categoryId = "Selected category does not exist.";
    }
  }

  if (errors.title || errors.content || errors.categoryId) {
    return {
      ok: false as const,
      state: {
        errors,
        values,
      },
    };
  }

  return {
    ok: true as const,
    values: values as GroupHackFormValues,
  };
}

function readHackFormValues(formData: FormData): Partial<GroupHackFormValues> {
  const difficulty = readFormString(formData, "difficulty");
  const status = readFormString(formData, "status");

  return {
    title: readFormString(formData, "title"),
    excerpt: nullableText(readFormString(formData, "excerpt")),
    content: readFormString(formData, "content"),
    imageUrl: nullableText(readFormString(formData, "imageUrl")),
    sourceUrl: nullableText(readFormString(formData, "sourceUrl")),
    categoryId: readPositiveInteger(formData, "categoryId"),
    difficulty: difficulties.includes(difficulty as GroupHackFormValues["difficulty"])
      ? (difficulty as GroupHackFormValues["difficulty"])
      : "easy",
    isOrganic: formData.get("isOrganic") === "on",
    isChemicalFree: formData.get("isChemicalFree") === "on",
    status: statuses.includes(status as GroupHackFormValues["status"])
      ? (status as GroupHackFormValues["status"])
      : "draft",
  };
}

function readFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function readPositiveInteger(formData: FormData, key: string) {
  const value = Number(formData.get(key));

  return Number.isInteger(value) && value > 0 ? value : undefined;
}

function nullableText(value: string) {
  return value.length > 0 ? value : null;
}

async function updatePublishedHackCount(
  groupId: number,
  previousStatus: "draft" | "published" | "archived",
  nextStatus: "draft" | "published" | "archived",
) {
  if (previousStatus === nextStatus) {
    return;
  }

  if (previousStatus !== "published" && nextStatus === "published") {
    await db
      .update(groups)
      .set({
        hacksCount: sql<number>`${groups.hacksCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, groupId));
  }

  if (previousStatus === "published" && nextStatus !== "published") {
    await db
      .update(groups)
      .set({
        hacksCount: sql<number>`greatest(${groups.hacksCount} - 1, 0)`,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, groupId));
  }
}

async function awardPublishingPoints(userId: number, hackId: number) {
  await db.insert(userPointsLog).values({
    userId,
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
    .where(eq(users.id, userId));
}
