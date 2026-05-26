import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardGroups } from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "My Groups",
};

export default async function MyGroupsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const memberships = await getDashboardGroups(user.id);

  return (
    <div className="rounded-lg border border-[#dfe8d8] bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
        My Groups
      </h1>
      <p className="mt-2 text-sm text-[#59655c]">
        Groups you joined and your role inside each community.
      </p>

      {memberships.length > 0 ? (
        <div className="mt-6 grid gap-4">
          {memberships.map((membership) => (
            <div
              key={membership.membershipId}
              className="rounded-lg border border-[#edf2e8] bg-[#f8faf7] p-4"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-black text-[#18231c]">
                    {membership.title}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#59655c]">
                    {membership.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-[#405046]">
                    <span className="rounded-md bg-white px-2.5 py-1 font-semibold">
                      Role: {membership.groupRole}
                    </span>
                    <span className="rounded-md bg-white px-2.5 py-1 font-semibold">
                      {membership.membersCount} members
                    </span>
                    <span className="rounded-md bg-white px-2.5 py-1 font-semibold">
                      {membership.hacksCount} hacks
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  <Link
                    href={`/groups/${membership.groupId}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#b7c8ad] bg-white px-3 py-2 text-sm font-semibold text-[#203525] hover:bg-[#f1f7ed]"
                  >
                    Group page
                  </Link>
                  <Link
                    href={`/groups/${membership.groupId}/leave`}
                    className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#efb5a8] bg-white px-3 py-2 text-sm font-semibold text-[#8a2d1c] hover:bg-[#fff0eb]"
                  >
                    Leave group
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="No joined groups yet"
            message="Join a gardening group later to see it here."
          />
        </div>
      )}
    </div>
  );
}
