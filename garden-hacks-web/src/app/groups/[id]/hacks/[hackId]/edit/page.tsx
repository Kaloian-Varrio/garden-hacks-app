import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { GroupHackForm } from "@/components/garden/group-hack-form";
import { getCurrentUser } from "@/lib/auth/session";
import { updateGroupHackAction } from "@/lib/group-hacks/actions";
import {
  getEditableGroupHack,
  getGroupHackFormOptions,
} from "@/lib/group-hacks/queries";

export const metadata: Metadata = {
  title: "Edit Group Hack",
};

type EditGroupHackPageProps = {
  params: Promise<{
    id: string;
    hackId: string;
  }>;
};

export default async function EditGroupHackPage({
  params,
}: EditGroupHackPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id, hackId: rawHackId } = await params;
  const groupId = Number(id);
  const hackId = Number(rawHackId);

  if (
    !Number.isInteger(groupId) ||
    groupId <= 0 ||
    !Number.isInteger(hackId) ||
    hackId <= 0
  ) {
    notFound();
  }

  const [hack, options] = await Promise.all([
    getEditableGroupHack(user, groupId, hackId),
    getGroupHackFormOptions(),
  ]);

  if (!hack) {
    notFound();
  }

  const action = updateGroupHackAction.bind(null, groupId, hackId);

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-lg border border-[#dfe8d8] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
              Edit hack
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#59655c]">
              Update this group hack or moderate its publication status.
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
            initialValues={hack}
            options={options}
            submitLabel="Save changes"
          />
        </div>
      </div>
    </div>
  );
}
