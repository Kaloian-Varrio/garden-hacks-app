import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { GroupForm } from "@/components/garden/group-form";
import { getCurrentUser } from "@/lib/auth/session";
import { createGroupAction } from "@/lib/groups/actions";
import { isAdmin } from "@/lib/groups/authorization";

export const metadata: Metadata = {
  title: "New Group",
};

export default async function NewGroupPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!isAdmin(user)) {
    redirect("/groups");
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-lg border border-[#dfe8d8] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
              New group
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#59655c]">
              Create a gardening community and assign yourself as its first
              manager.
            </p>
          </div>
          <Link href="/groups" className="text-sm font-bold text-[#2f6f3e]">
            Cancel
          </Link>
        </div>

        <div className="mt-8">
          <GroupForm action={createGroupAction} submitLabel="Create group" />
        </div>
      </div>
    </div>
  );
}
