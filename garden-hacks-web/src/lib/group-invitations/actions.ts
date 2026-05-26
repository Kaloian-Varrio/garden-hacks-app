"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { db, groupInvitations } from "@/db";
import { getCurrentUser } from "@/lib/auth/session";
import { requireGroupManager } from "@/lib/groups/authorization";

export type InviteActionState = {
  error?: string;
  inviteUrl?: string;
};

export async function createGroupInviteAction(
  groupId: number,
  previousState: InviteActionState,
): Promise<InviteActionState> {
  void previousState;

  const user = await getCurrentUser();

  if (!user) {
    return {
      error: "Login is required to create invite links.",
    };
  }

  const canManage = await requireGroupManager(user, groupId);

  if (!canManage) {
    return {
      error: "Only group managers and admins can create invite links.",
    };
  }

  const inviteCode = await createUniqueInviteCode();

  await db.insert(groupInvitations).values({
    groupId,
    inviteCode,
    createdByUserId: user.id,
  });

  return {
    inviteUrl: await createAbsoluteInviteUrl(groupId, inviteCode),
  };
}

async function createUniqueInviteCode() {
  while (true) {
    const code = randomBytes(24).toString("base64url");
    const existing = await db.query.groupInvitations.findFirst({
      where: eq(groupInvitations.inviteCode, code),
      columns: {
        id: true,
      },
    });

    if (!existing) {
      return code;
    }
  }
}

async function createAbsoluteInviteUrl(groupId: number, inviteCode: string) {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto =
    headerStore.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") ? "http" : "https");
  const path = `/groups/${groupId}/join?code=${encodeURIComponent(inviteCode)}`;

  return host ? `${proto}://${host}${path}` : path;
}
