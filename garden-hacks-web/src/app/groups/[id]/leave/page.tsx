import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { leaveGroupAction } from "@/lib/groups/actions";
import { getLeaveGroupInfo } from "@/lib/groups/queries";

export const metadata: Metadata = {
  title: "Leave Group",
};

type LeaveGroupPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    error?: string | string[];
  }>;
};

export default async function LeaveGroupPage({
  params,
  searchParams,
}: LeaveGroupPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const groupId = Number(id);

  if (!Number.isInteger(groupId) || groupId <= 0) {
    notFound();
  }

  const [leaveInfo, resolvedSearchParams] = await Promise.all([
    getLeaveGroupInfo(user.id, groupId),
    searchParams,
  ]);

  if (!leaveInfo) {
    return (
      <LeaveMessage
        title="You are not a member of this group"
        message="Only current group members can leave a group."
        groupId={groupId}
      />
    );
  }

  const error = readSearchParam(resolvedSearchParams?.error);
  const isOnlyManager =
    leaveInfo.groupRole === "manager" && leaveInfo.managerCount <= 1;
  const showOnlyManagerMessage = isOnlyManager || error === "only-manager";
  const action = leaveGroupAction.bind(null, groupId);

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-lg border border-[#efb5a8] bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
          Leave {leaveInfo.title}?
        </h1>
        <p className="mt-4 leading-7 text-[#59655c]">
          You will lose member access to this group and its private group
          content. You can rejoin later only if you receive another invite.
        </p>
        {showOnlyManagerMessage ? (
          <p className="mt-5 rounded-md border border-[#efb5a8] bg-[#fff0eb] px-4 py-3 text-sm font-semibold text-[#8a2d1c]">
            You cannot leave this group because you are the only group manager.
          </p>
        ) : null}
        {error === "not-member" ? (
          <p className="mt-5 rounded-md border border-[#efb5a8] bg-[#fff0eb] px-4 py-3 text-sm font-semibold text-[#8a2d1c]">
            Only current group members can leave a group.
          </p>
        ) : null}
        <div className="mt-7 flex flex-wrap gap-3">
          {!showOnlyManagerMessage ? (
            <form action={action}>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#8a2d1c] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#6f2115]"
              >
                Confirm leave
              </button>
            </form>
          ) : null}
          <Link
            href={`/groups/${groupId}`}
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#b7c8ad] bg-white px-5 py-2.5 text-sm font-semibold text-[#203525] hover:bg-[#f1f7ed]"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}

function LeaveMessage({
  groupId,
  message,
  title,
}: {
  groupId: number;
  message: string;
  title: string;
}) {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-lg border border-[#dfe8d8] bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
          {title}
        </h1>
        <p className="mt-4 leading-7 text-[#59655c]">{message}</p>
        <Link
          href={`/groups/${groupId}`}
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-md bg-[#2f6f3e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#285d35]"
        >
          Back to group
        </Link>
      </div>
    </div>
  );
}

function readSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
