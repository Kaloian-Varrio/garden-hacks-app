import "server-only";

import { and, eq, isNull, sql } from "drizzle-orm";
import { db, groupInvitations, groupMembers, groups } from "@/db";
import type { AuthUser } from "@/lib/auth/session";

export type InviteAcceptResult =
  | {
      status: "success";
      group: {
        id: number;
        title: string;
      };
    }
  | {
      status: "error";
      title: string;
      message: string;
    };

export async function acceptGroupInvite({
  groupId,
  inviteCode,
  user,
}: {
  groupId: number;
  inviteCode: string | null;
  user: AuthUser;
}): Promise<InviteAcceptResult> {
  if (!inviteCode) {
    return {
      status: "error",
      title: "Missing invite code",
      message: "This invite link is missing its invite code.",
    };
  }

  const invite = await db.query.groupInvitations.findFirst({
    where: eq(groupInvitations.inviteCode, inviteCode),
    columns: {
      id: true,
      groupId: true,
      usedAt: true,
    },
    with: {
      group: {
        columns: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!invite) {
    return {
      status: "error",
      title: "Invalid link",
      message: "This invite link is not valid.",
    };
  }

  if (invite.groupId !== groupId) {
    return {
      status: "error",
      title: "Invite mismatch",
      message: "This invite code does not belong to this group.",
    };
  }

  if (invite.usedAt) {
    return {
      status: "error",
      title: "Invite already used",
      message: "This invite link has already been used.",
    };
  }

  const existingMembership = await db.query.groupMembers.findFirst({
    where: and(eq(groupMembers.groupId, groupId), eq(groupMembers.userId, user.id)),
    columns: {
      id: true,
    },
  });

  if (existingMembership) {
    return {
      status: "error",
      title: "Already a member",
      message: "You are already a member of this group.",
    };
  }

  const [usedInvite] = await db
    .update(groupInvitations)
    .set({
      usedAt: new Date(),
      usedByUserId: user.id,
    })
    .where(
      and(
        eq(groupInvitations.id, invite.id),
        eq(groupInvitations.groupId, groupId),
        isNull(groupInvitations.usedAt),
      ),
    )
    .returning({
      id: groupInvitations.id,
    });

  if (!usedInvite) {
    return {
      status: "error",
      title: "Invite already used",
      message: "This invite link has already been used.",
    };
  }

  try {
    await db.insert(groupMembers).values({
      groupId,
      userId: user.id,
      groupRole: "member",
    });
    await db
      .update(groups)
      .set({
        membersCount: sql<number>`${groups.membersCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(groups.id, groupId));
  } catch {
    return {
      status: "error",
      title: "Joining was not successful",
      message: "The invite was valid, but joining the group did not complete.",
    };
  }

  return {
    status: "success",
    group: invite.group,
  };
}
