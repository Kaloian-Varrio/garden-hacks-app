import "server-only";

import { and, eq } from "drizzle-orm";
import { db, groupMembers } from "@/db";
import type { AuthUser } from "@/lib/auth/session";

export function isAdmin(user: AuthUser) {
  return user.role === "admin";
}

export async function isGroupMember(userId: number, groupId: number) {
  const membership = await db.query.groupMembers.findFirst({
    where: and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, userId)),
    columns: {
      id: true,
    },
  });

  return Boolean(membership);
}

export async function isGroupManager(userId: number, groupId: number) {
  const membership = await db.query.groupMembers.findFirst({
    where: and(
      eq(groupMembers.groupId, groupId),
      eq(groupMembers.userId, userId),
      eq(groupMembers.groupRole, "manager"),
    ),
    columns: {
      id: true,
    },
  });

  return Boolean(membership);
}

export async function requireGroupManager(user: AuthUser, groupId: number) {
  if (isAdmin(user)) {
    return true;
  }

  return isGroupManager(user.id, groupId);
}
