import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { getCurrentUser } from "@/lib/auth/session";
import { isAdmin } from "@/lib/groups/authorization";
import { getUserGroups } from "@/lib/groups/queries";

export const metadata: Metadata = {
  title: "Groups",
};

export default async function GroupsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const groups = await getUserGroups(user);
  const canCreateGroups = isAdmin(user);

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <SectionTitle eyebrow="Your groups" title="Groups you belong to">
            View the gardening communities you have joined and open a group to see
            its members, managers, and published hacks.
          </SectionTitle>
          {canCreateGroups ? (
            <Link
              href="/groups/new"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-md bg-[#2f6f3e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#285d35]"
            >
              New
            </Link>
          ) : null}
        </div>

        {groups.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <article
                key={group.membershipId}
                className="overflow-hidden rounded-lg border border-[#dfe8d8] bg-white shadow-sm"
              >
                <div className="relative aspect-[16/10] bg-[#dfe8d8]">
                  <Image
                    src={
                      group.imageUrl ??
                      "https://placehold.co/1200x800/e8f5dc/31572c/png?text=Garden+Group"
                    }
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-black text-[#18231c]">
                    {group.title}
                  </h2>
                  <p className="mt-2 min-h-20 text-sm leading-6 text-[#59655c]">
                    {group.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-[#405046]">
                    <span className="rounded-md bg-[#ecf7e8] px-2.5 py-1 font-semibold">
                      Role: {group.groupRole}
                    </span>
                    <span className="rounded-md bg-[#eef8fd] px-2.5 py-1 font-semibold">
                      {group.membersCount} members
                    </span>
                    <span className="rounded-md bg-[#fff8e1] px-2.5 py-1 font-semibold">
                      {group.hacksCount} hacks
                    </span>
                  </div>
                  <Link
                    href={`/groups/${group.groupId}`}
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[#b7c8ad] bg-white px-5 py-2.5 text-sm font-semibold text-[#203525] hover:bg-[#f1f7ed]"
                  >
                    View group details
                  </Link>
                  {group.canManage ? (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link
                        href={`/groups/${group.groupId}/edit`}
                        className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#b7c8ad] bg-white px-3 py-2 text-sm font-semibold text-[#203525] hover:bg-[#f1f7ed]"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/groups/${group.groupId}/delete`}
                        className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#efb5a8] bg-white px-3 py-2 text-sm font-semibold text-[#8a2d1c] hover:bg-[#fff0eb]"
                      >
                        Delete
                      </Link>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              title="You are not a member of any groups yet."
              message="Join a group before private group details appear here."
            />
          </div>
        )}
      </div>
    </div>
  );
}
