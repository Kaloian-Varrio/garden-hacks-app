import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { GroupHackForm } from "@/components/garden/group-hack-form";
import { getCurrentUser } from "@/lib/auth/session";
import { createGroupHackAction } from "@/lib/group-hacks/actions";
import { getGroupHackFormOptions } from "@/lib/group-hacks/queries";
import { isGroupMember } from "@/lib/groups/authorization";

export const metadata: Metadata = {
  title: "Create Group Hack",
};

type NewGroupHackPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NewGroupHackPage({
  params,
}: NewGroupHackPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const groupId = Number(id);

  if (!Number.isInteger(groupId) || groupId <= 0) {
    notFound();
  }

  const canCreate = await isGroupMember(user.id, groupId);

  if (!canCreate) {
    redirect(`/groups/${groupId}`);
  }

  const options = await getGroupHackFormOptions();
  const action = createGroupHackAction.bind(null, groupId);

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-lg border border-[#dfe8d8] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
              Create hack
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#59655c]">
              Share a practical idea with this group.
            </p>
          </div>
          <Link
            href={`/groups/${groupId}`}
            className="text-sm font-bold text-[#2f6f3e]"
          >
            Cancel
          </Link>
        </div>

        <div className="mt-8">
          <GroupHackForm
            action={action}
            options={options}
            submitLabel="Create hack"
          />
        </div>
      </div>
    </div>
  );
}
