import "server-only";

import { and, eq } from "drizzle-orm";
import { categories, db, gardeningHacks } from "@/db";
import type { AuthUser } from "@/lib/auth/session";
import { isGroupManager } from "@/lib/groups/authorization";
import type { GroupHackFormOptions, GroupHackFormValues } from "./types";

export async function getGroupHackFormOptions(): Promise<GroupHackFormOptions> {
  const categoryRows = await db
    .select({ id: categories.id, title: categories.title })
    .from(categories)
    .orderBy(categories.title);

  return {
    categories: categoryRows,
  };
}

export async function getEditableGroupHack(
  user: AuthUser,
  groupId: number,
  hackId: number,
): Promise<(GroupHackFormValues & { id: number; title: string }) | null> {
  const hack = await db.query.gardeningHacks.findFirst({
    where: and(eq(gardeningHacks.id, hackId), eq(gardeningHacks.groupId, groupId)),
    columns: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      sourceUrl: true,
      authorId: true,
      categoryId: true,
      difficulty: true,
      isOrganic: true,
      isChemicalFree: true,
      status: true,
    },
  });

  if (!hack) {
    return null;
  }

  const canManage =
    user.role === "admin" ||
    hack.authorId === user.id ||
    (await isGroupManager(user.id, groupId));

  if (!canManage) {
    return null;
  }

  return {
    id: hack.id,
    title: hack.title,
    excerpt: hack.excerpt ?? "",
    content: hack.content,
    imageUrl: hack.imageUrl ?? "",
    sourceUrl: hack.sourceUrl ?? "",
    categoryId: hack.categoryId,
    difficulty: hack.difficulty,
    isOrganic: hack.isOrganic,
    isChemicalFree: hack.isChemicalFree,
    status: hack.status,
  };
}

export async function getDeletableGroupHack(
  user: AuthUser,
  groupId: number,
  hackId: number,
) {
  const hack = await db.query.gardeningHacks.findFirst({
    where: and(eq(gardeningHacks.id, hackId), eq(gardeningHacks.groupId, groupId)),
    columns: {
      id: true,
      title: true,
      authorId: true,
      status: true,
    },
  });

  if (!hack) {
    return null;
  }

  const canManage =
    user.role === "admin" ||
    hack.authorId === user.id ||
    (await isGroupManager(user.id, groupId));

  return canManage ? hack : null;
}
