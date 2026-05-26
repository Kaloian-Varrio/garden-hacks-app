import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import {
  demoteGroupManagerAction,
  promoteGroupMemberAction,
  removeGroupMemberAction,
} from "@/lib/groups/actions";
import { requireGroupManager } from "@/lib/groups/authorization";
import { getManagedGroupMembers } from "@/lib/groups/queries";

export const metadata: Metadata = {
  title: "Manage Members",
};

type ManageMembersPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    error?: string | string[];
    success?: string | string[];
  }>;
};

export default async function ManageMembersPage({
  params,
  searchParams,
}: ManageMembersPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const groupId = Number(id);

  if (!Number.isInteger(groupId) || groupId <= 0) {
    notFound();
  }

  const canManage = await requireGroupManager(user, groupId);

  if (!canManage) {
    redirect(`/groups/${groupId}`);
  }

  const [group, resolvedSearchParams] = await Promise.all([
    getManagedGroupMembers(user.id, groupId),
    searchParams,
  ]);

  if (!group) {
    notFound();
  }

  const error = getMessage("error", readSearchParam(resolvedSearchParams?.error));
  const success = getMessage("success", readSearchParam(resolvedSearchParams?.success));

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
              Manage members
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#59655c]">
              {group.title} · {group.membersCount} members
            </p>
          </div>
          <Link
            href={`/groups/${groupId}`}
            className="text-sm font-bold text-[#2f6f3e]"
          >
            Back to group
          </Link>
        </div>

        {error ? (
          <p className="mt-6 rounded-md border border-[#efb5a8] bg-[#fff0eb] px-4 py-3 text-sm font-semibold text-[#8a2d1c]">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="mt-6 rounded-md border border-[#b8d6ad] bg-[#ecf7e8] px-4 py-3 text-sm font-semibold text-[#285d35]">
            {success}
          </p>
        ) : null}

        <div className="mt-8 overflow-x-auto rounded-lg border border-[#dfe8d8] bg-white shadow-sm">
          <table className="w-full min-w-[920px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.12em] text-[#59655c]">
                <th className="border-b border-[#dfe8d8] px-4 py-3">Name</th>
                <th className="border-b border-[#dfe8d8] px-4 py-3">Email</th>
                <th className="border-b border-[#dfe8d8] px-4 py-3">Role</th>
                <th className="border-b border-[#dfe8d8] px-4 py-3">Joined</th>
                <th className="border-b border-[#dfe8d8] px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {group.members.map((member) => {
                const isLastManager =
                  member.groupRole === "manager" && group.managerCount <= 1;

                return (
                  <tr key={member.membershipId} className="align-top">
                    <td className="border-b border-[#edf2e8] px-4 py-4 font-bold text-[#18231c]">
                      {member.name}
                      {member.isCurrentUser ? (
                        <span className="ml-2 rounded-md bg-[#edf5e9] px-2 py-1 text-xs text-[#285d35]">
                          You
                        </span>
                      ) : null}
                    </td>
                    <td className="border-b border-[#edf2e8] px-4 py-4 text-[#405046]">
                      {member.email}
                    </td>
                    <td className="border-b border-[#edf2e8] px-4 py-4 text-[#405046]">
                      {member.groupRole}
                    </td>
                    <td className="border-b border-[#edf2e8] px-4 py-4 text-[#405046]">
                      {formatDate(member.joinedAt)}
                    </td>
                    <td className="border-b border-[#edf2e8] px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {member.groupRole === "member" ? (
                          <form
                            action={promoteGroupMemberAction.bind(
                              null,
                              groupId,
                              member.membershipId,
                            )}
                          >
                            <button
                              type="submit"
                              className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#b7c8ad] bg-white px-3 py-2 text-sm font-semibold text-[#203525] hover:bg-[#f1f7ed]"
                            >
                              Promote
                            </button>
                          </form>
                        ) : (
                          <form
                            action={demoteGroupManagerAction.bind(
                              null,
                              groupId,
                              member.membershipId,
                            )}
                          >
                            <button
                              type="submit"
                              disabled={isLastManager}
                              className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#b7c8ad] bg-white px-3 py-2 text-sm font-semibold text-[#203525] hover:bg-[#f1f7ed] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Demote
                            </button>
                          </form>
                        )}
                        <form
                          action={removeGroupMemberAction.bind(
                            null,
                            groupId,
                            member.membershipId,
                          )}
                        >
                          <button
                            type="submit"
                            disabled={isLastManager}
                            className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#efb5a8] bg-white px-3 py-2 text-sm font-semibold text-[#8a2d1c] hover:bg-[#fff0eb] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Remove
                          </button>
                        </form>
                      </div>
                      {isLastManager ? (
                        <p className="mt-2 text-xs font-semibold text-[#8a2d1c]">
                          Last manager cannot be removed or demoted.
                        </p>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function readSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getMessage(type: "error" | "success", value: string | undefined) {
  if (type === "error") {
    const messages: Record<string, string> = {
      "member-not-found": "This group member was not found.",
      "last-manager": "At least one group manager must remain.",
    };

    return value ? messages[value] : null;
  }

  const messages: Record<string, string> = {
    removed: "Member removed.",
    promoted: "Member promoted to manager.",
    demoted: "Manager demoted to member.",
  };

  return value ? messages[value] : null;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
