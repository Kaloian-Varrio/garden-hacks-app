"use client";

import { useRouter, useSearchParams } from "next/navigation";

type HacksFiltersProps = {
  categories: string[];
  groups: string[];
  difficulties: string[];
  ratings: string[];
  selected: {
    category?: string;
    group?: string;
    difficulty?: string;
    tag?: string;
    rating?: string;
  };
};

export function HacksFilters({
  categories,
  groups,
  difficulties,
  ratings,
  selected,
}: HacksFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    params.delete("page");
    router.push(`/hacks?${params.toString()}`);
  }

  return (
    <div className="garden-shell mt-10 grid gap-3 rounded-3xl p-4 md:grid-cols-4">
      <FilterSelect
        label="Group"
        name="group"
        options={groups}
        value={selected.group ?? ""}
        onChange={updateFilter}
      />
      <FilterSelect
        label="Difficulty"
        name="difficulty"
        options={difficulties}
        value={selected.difficulty ?? ""}
        onChange={updateFilter}
      />
      <FilterSelect
        label="Theme"
        name="tag"
        options={categories}
        value={selected.tag ?? selected.category ?? ""}
        onChange={updateFilter}
      />
      <FilterSelect
        label="Rating"
        name="rating"
        options={ratings}
        value={selected.rating ?? ""}
        onChange={updateFilter}
      />
    </div>
  );
}

function FilterSelect({
  label,
  name,
  onChange,
  options,
  value,
}: {
  label: string;
  name: string;
  onChange: (name: string, value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#405046]">
      {label}
      <select
        className="h-11 rounded-2xl border border-[#b7e7d1] bg-white/80 px-3 text-sm text-[#10231c] outline-none focus:border-[#0f9f93] focus:ring-4 focus:ring-[#5bd8d0]/20"
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
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
