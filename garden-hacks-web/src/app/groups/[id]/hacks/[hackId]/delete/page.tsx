import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { deleteGroupHackAction } from "@/lib/group-hacks/actions";
import { getDeletableGroupHack } from "@/lib/group-hacks/queries";

export const metadata: Metadata = {
  title: "Delete Group Hack",
};

type DeleteGroupHackPageProps = {
  params: Promise<{
    id: string;
    hackId: string;
  }>;
};

export default async function DeleteGroupHackPage({
  params,
}: DeleteGroupHackPageProps) {
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

  const hack = await getDeletableGroupHack(user, groupId, hackId);

  if (!hack) {
    notFound();
  }

  const action = deleteGroupHackAction.bind(null, groupId, hackId);

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-lg border border-[#efb5a8] bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
          Delete {hack.title}?
        </h1>
        <p className="mt-4 leading-7 text-[#59655c]">
          This will permanently delete the hack and its related comments, likes,
          votes, and saved references. This action cannot be undone.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <form action={action}>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#8a2d1c] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#6f2115]"
            >
              Confirm delete
            </button>
          </form>
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
