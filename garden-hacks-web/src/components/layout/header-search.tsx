"use client";

import { useSearchParams } from "next/navigation";
import { SearchIcon } from "@/components/ui/garden-icons";

export function HeaderSearch({ className = "" }: { className?: string }) {
  const searchParams = useSearchParams();

  return (
    <form action="/hacks" className={className} role="search">
      <label className="relative block">
        <span className="sr-only">Search hacks</span>
        <SearchIcon
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0f766e]"
          size={17}
        />
        <input
          name="q"
          type="search"
          defaultValue={searchParams.get("q") ?? ""}
          placeholder="Search hacks"
          className="h-11 w-full rounded-full border border-[#b7e7d1] bg-white/88 pl-10 pr-4 text-sm font-semibold text-[#10231c] shadow-sm outline-none transition placeholder:text-[#7d9488] focus:border-[#0f9f93] focus:ring-4 focus:ring-[#5bd8d0]/20"
        />
      </label>
    </form>
  );
}

