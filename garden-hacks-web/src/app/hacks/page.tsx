import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { HackCard } from "@/components/garden/hack-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { getFilterOptions, getPublicHacksPage } from "@/lib/public-data/queries";

export const metadata: Metadata = {
  title: "Hacks",
};

type HacksPageProps = {
  searchParams?: Promise<{
    page?: string | string[];
    pageSize?: string | string[];
  }>;
};

export default async function HacksPage({ searchParams }: HacksPageProps) {
  const resolvedSearchParams = await searchParams;
  const [hackPage, filters] = await Promise.all([
    getPublicHacksPage({
      page: parsePositiveInteger(readSearchParam(resolvedSearchParams?.page)),
      pageSize: parsePositiveInteger(
        readSearchParam(resolvedSearchParams?.pageSize),
      ),
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

        <div className="mt-10 grid gap-3 rounded-lg border border-[#dfe8d8] bg-white p-4 md:grid-cols-4">
          <FilterSelect label="Category" options={filters.categories} />
          <FilterSelect label="Group" options={filters.groups} />
          <FilterSelect label="Difficulty" options={filters.difficulties} />
          <FilterSelect label="Rating" options={filters.ratings} />
        </div>

        {hacks.length > 0 ? (
          <div className="mt-8">
            <div className="grid gap-5">
              {hacks.map((hack) => (
                <HackCard key={hack.id} hack={hack} />
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 rounded-lg border border-[#dfe8d8] bg-white p-4 text-sm text-[#59655c] sm:flex-row sm:items-center sm:justify-between">
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
          <div className="mt-10">
            <EmptyState
              title="No published hacks yet"
              message="Seed the database or publish gardening hacks to fill this public listing."
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

function getPageHref(page: number, pageSize: number) {
  return `/hacks?page=${page}&pageSize=${pageSize}`;
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

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#405046]">
      {label}
      <select
        className="h-11 rounded-md border border-[#cbd9c2] bg-[#f8faf7] px-3 text-sm text-[#18231c]"
        defaultValue=""
      >
        <option value="">All {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
