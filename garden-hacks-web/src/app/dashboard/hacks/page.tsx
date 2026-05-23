import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DeleteHackButton } from "@/components/dashboard/delete-hack-button";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardHacks } from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "My Hacks",
};

export default async function MyHacksPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const hacks = await getDashboardHacks(user.id);

  return (
    <div className="rounded-lg border border-[#dfe8d8] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
            My Hacks
          </h1>
          <p className="mt-2 text-sm text-[#59655c]">
            Manage drafts, published hacks, and archived ideas.
          </p>
        </div>
        <Button href="/dashboard/hacks/new">Create hack</Button>
      </div>

      {hacks.length > 0 ? (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[900px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.12em] text-[#59655c]">
                <th className="border-b border-[#dfe8d8] py-3 pr-4">Hack</th>
                <th className="border-b border-[#dfe8d8] py-3 pr-4">Status</th>
                <th className="border-b border-[#dfe8d8] py-3 pr-4">Group</th>
                <th className="border-b border-[#dfe8d8] py-3 pr-4">Category</th>
                <th className="border-b border-[#dfe8d8] py-3 pr-4">Votes</th>
                <th className="border-b border-[#dfe8d8] py-3 pr-4">Comments</th>
                <th className="border-b border-[#dfe8d8] py-3 pr-4">Created</th>
                <th className="border-b border-[#dfe8d8] py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hacks.map((hack) => (
                <tr key={hack.id} className="align-top">
                  <td className="border-b border-[#edf2e8] py-4 pr-4 font-bold text-[#18231c]">
                    {hack.title}
                  </td>
                  <td className="border-b border-[#edf2e8] py-4 pr-4">
                    <StatusBadge status={hack.status} />
                  </td>
                  <td className="border-b border-[#edf2e8] py-4 pr-4 text-[#405046]">
                    {hack.group}
                  </td>
                  <td className="border-b border-[#edf2e8] py-4 pr-4 text-[#405046]">
                    {hack.category}
                  </td>
                  <td className="border-b border-[#edf2e8] py-4 pr-4 text-[#405046]">
                    {hack.sweetTomatoesCount} sweet / {hack.bitterCucumbersCount} bitter
                    <span className="block font-bold text-[#18231c]">
                      Score {hack.ratingScore}
                    </span>
                  </td>
                  <td className="border-b border-[#edf2e8] py-4 pr-4 text-[#405046]">
                    {hack.commentsCount}
                  </td>
                  <td className="border-b border-[#edf2e8] py-4 pr-4 text-[#405046]">
                    {formatDate(hack.createdAt)}
                  </td>
                  <td className="border-b border-[#edf2e8] py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/hacks/${hack.id}/edit`}
                        className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#b7c8ad] bg-white px-3 py-2 text-sm font-semibold text-[#203525] hover:bg-[#f1f7ed]"
                      >
                        Edit
                      </Link>
                      <DeleteHackButton hackId={hack.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="No hacks yet"
            message="Create your first gardening hack as a draft or publish it to the community."
            actionHref="/dashboard/hacks/new"
            actionLabel="Create hack"
          />
        </div>
      )}
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
