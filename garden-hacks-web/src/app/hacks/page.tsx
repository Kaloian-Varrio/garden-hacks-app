import type { Metadata } from "next";
import { HackCard } from "@/components/garden/hack-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { getFilterOptions, getPublicHacks } from "@/lib/public-data/queries";

export const metadata: Metadata = {
  title: "Hacks",
};

export default async function HacksPage() {
  const [hacks, filters] = await Promise.all([
    getPublicHacks(),
    getFilterOptions(),
  ]);

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
          <div className="mt-8 grid gap-5">
            {hacks.map((hack) => (
              <HackCard key={hack.id} hack={hack} />
            ))}
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
