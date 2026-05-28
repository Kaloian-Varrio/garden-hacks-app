import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
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

type MyHacksPageProps = {
  searchParams?: Promise<{
    page?: string | string[];
    pageSize?: string | string[];
  }>;
};

export default async function MyHacksPage({ searchParams }: MyHacksPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const resolvedSearchParams = await searchParams;
  const result = await getDashboardHacks(user.id, {
    page: parsePositiveInteger(readSearchParam(resolvedSearchParams?.page)),
    pageSize: parsePositiveInteger(
      readSearchParam(resolvedSearchParams?.pageSize),
    ),
  });
  const { hacks, currentPage, pageSize, totalItems, totalPages } = result;
  const displayTotalPages = Math.max(totalPages, 1);
  const firstVisibleItem =
    totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const lastVisibleItem = Math.min(currentPage * pageSize, totalItems);

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
                    <Link href={`/hacks/${hack.slug}`} className="hover:text-[#176b49] hover:underline">
                      {hack.title}
                    </Link>
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
                        href={`/hacks/${hack.slug}`}
                        className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#c4e6e9] bg-[#f2fbff] px-3 py-2 text-sm font-semibold text-[#0a5a60] hover:bg-[#e2f7ff]"
                      >
                        View
                      </Link>
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
          <div className="mt-5 flex flex-col gap-3 border-t border-[#edf2e8] pt-5 text-sm text-[#59655c] sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {firstVisibleItem}-{lastVisibleItem} of {totalItems} hacks
            </p>
            <div className="flex items-center gap-2">
              <PaginationLink
                href={getPageHref(currentPage - 1, pageSize)}
                disabled={currentPage <= 1}
              >
                Previous
              </PaginationLink>
              <span className="min-w-24 text-center font-bold text-[#18231c]">
                Page {currentPage} of {displayTotalPages}
              </span>
              <PaginationLink
                href={getPageHref(currentPage + 1, pageSize)}
                disabled={currentPage >= displayTotalPages}
              >
                Next
              </PaginationLink>
            </div>
          </div>
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

function readSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInteger(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : undefined;
}

function getPageHref(page: number, pageSize: number) {
  return `/dashboard/hacks?page=${page}&pageSize=${pageSize}`;
}

function PaginationLink({
  children,
  disabled,
  href,
}: {
  children: ReactNode;
  disabled: boolean;
  href: string;
}) {
  const className =
    "inline-flex min-h-10 items-center justify-center rounded-md border px-3 py-2 text-sm font-semibold";

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={`${className} cursor-not-allowed border-[#dfe8d8] bg-[#f8faf7] text-[#8a968d]`}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`${className} border-[#b7c8ad] bg-white text-[#203525] hover:bg-[#f1f7ed]`}
    >
      {children}
    </Link>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
