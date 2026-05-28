"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "My Profile" },
  { href: "/dashboard/hacks", label: "My Hacks" },
  { href: "/dashboard/hacks/new", label: "Create Hack" },
  { href: "/dashboard/saved-hacks", label: "Saved Hacks" },
  { href: "/dashboard/groups", label: "My Groups" },
];

export function DashboardNav({ role }: { role: "user" | "admin" }) {
  const pathname = usePathname();
  const visibleItems =
    role === "admin"
      ? [...items, { href: "/dashboard/users", label: "Users Management" }]
      : items;

  return (
    <nav className="grid gap-1" aria-label="Dashboard navigation">
      {visibleItems.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-[#2f6f3e] text-white"
                : "text-[#405046] hover:bg-[#edf5e9] hover:text-[#203525]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
