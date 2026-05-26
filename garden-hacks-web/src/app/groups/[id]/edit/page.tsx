import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { GroupForm } from "@/components/garden/group-form";
import { getCurrentUser } from "@/lib/auth/session";
import { updateGroupAction } from "@/lib/groups/actions";
import { requireGroupManager } from "@/lib/groups/authorization";
import { getEditableGroup } from "@/lib/groups/queries";

export const metadata: Metadata = {
  title: "Edit Group",
};

type EditGroupPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditGroupPage({ params }: EditGroupPageProps) {
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

  const group = await getEditableGroup(groupId);

  if (!group) {
    notFound();
  }

  const action = updateGroupAction.bind(null, groupId);

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-lg border border-[#dfe8d8] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
              Edit group
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#59655c]">
              Update the group profile shown to its members.
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
          <GroupForm
            action={action}
            initialValues={group}
            submitLabel="Save changes"
          />
        </div>
      </div>
    </div>
  );
}
