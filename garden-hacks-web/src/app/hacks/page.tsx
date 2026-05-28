import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { HackCard } from "@/components/garden/hack-card";
import { HacksFilters } from "@/components/garden/hacks-filters";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { getCurrentUser } from "@/lib/auth/session";
import { getFilterOptions, getPublicHacksPage } from "@/lib/public-data/queries";

export const metadata: Metadata = {
  title: "Hacks",
};

type HacksPageProps = {
  searchParams?: Promise<HacksSearchParams>;
};

type HacksSearchParams = {
  page?: string | string[];
  pageSize?: string | string[];
  q?: string | string[];
  tag?: string | string[];
  category?: string | string[];
  group?: string | string[];
  difficulty?: string | string[];
  rating?: string | string[];
};

export default async function HacksPage({ searchParams }: HacksPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentUser = await getCurrentUser();
  const [hackPage, filters] = await Promise.all([
    getPublicHacksPage({
      page: parsePositiveInteger(readSearchParam(resolvedSearchParams?.page)),
      pageSize: parsePositiveInteger(
        readSearchParam(resolvedSearchParams?.pageSize),
      ),
      q: readSearchParam(resolvedSearchParams?.q),
      tag: readSearchParam(resolvedSearchParams?.tag),
      category: readSearchParam(resolvedSearchParams?.category),
      group: readSearchParam(resolvedSearchParams?.group),
      difficulty: readSearchParam(resolvedSearchParams?.difficulty),
      rating: readSearchParam(resolvedSearchParams?.rating),
      viewerUserId: currentUser?.id,
    }),
    getFilterOptions(),
  ]);
  const { hacks, currentPage, pageSize, totalItems, totalPages } = hackPage;
  const displayTotalPages = Math.max(totalPages, 1);
  const firstVisibleItem =
    totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const lastVisibleItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Public hacks" title="Browse gardening hacks">
          Discover published ideas from the community and compare them by topic,
          group, difficulty, and rating.
        </SectionTitle>

        <HacksFilters
          categories={filters.categories}
          groups={filters.groups}
          difficulties={filters.difficulties}
          ratings={filters.ratings}
          selected={{
            category: readSearchParam(resolvedSearchParams?.category),
            group: readSearchParam(resolvedSearchParams?.group),
            difficulty: readSearchParam(resolvedSearchParams?.difficulty),
            tag: readSearchParam(resolvedSearchParams?.tag),
            rating: readSearchParam(resolvedSearchParams?.rating),
          }}
        />

        {hacks.length > 0 ? (
          <div className="mt-8">
            <div className="grid gap-5">
              {hacks.map((hack) => (
                <HackCard
                  key={hack.id}
                  hack={hack}
                  isLoggedIn={Boolean(currentUser)}
                />
              ))}
            </div>
            <div className="garden-shell mt-6 flex flex-col gap-3 rounded-3xl p-4 text-sm text-[#59655c] sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {firstVisibleItem}-{lastVisibleItem} of {totalItems} hacks
              </p>
              <div className="flex items-center gap-2">
                <PaginationLink
                  href={getPageHref(
                    currentPage - 1,
                    pageSize,
                    resolvedSearchParams,
                  )}
                  disabled={currentPage <= 1}
                >
                  Previous
                </PaginationLink>
                <span className="min-w-24 text-center font-bold text-[#18231c]">
                  Page {currentPage} of {displayTotalPages}
                </span>
                <PaginationLink
                  href={getPageHref(
                    currentPage + 1,
                    pageSize,
                    resolvedSearchParams,
                  )}
                  disabled={currentPage >= displayTotalPages}
                >
                  Next
                </PaginationLink>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              title="No matching hacks"
              message="Try changing the search or filters to find more gardening ideas."
            />
          </div>
        )}
      </div>
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

function getPageHref(
  page: number,
  pageSize: number,
  searchParams: HacksSearchParams | undefined,
) {
  const params = new URLSearchParams();

  for (const key of ["q", "tag", "category", "group", "difficulty", "rating"] as const) {
    const value = readSearchParam(searchParams?.[key]);

    if (value) {
      params.set(key, value);
    }
  }

  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  return `/hacks?${params.toString()}`;
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
      className={`${className} border-[#b7e7d1] bg-white text-[#203525] hover:bg-[#e9fbef]`}
    >
      {children}
    </Link>
  );
}
