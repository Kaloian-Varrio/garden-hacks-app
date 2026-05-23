import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-lg border border-[#dfe8d8] bg-white p-3 shadow-sm lg:sticky lg:top-24">
          <div className="border-b border-[#edf2e8] px-3 pb-3">
            <p className="text-sm font-black text-[#18231c]">{user.name}</p>
            <p className="mt-1 truncate text-xs text-[#59655c]">{user.email}</p>
          </div>
          <div className="pt-3">
            <DashboardNav />
          </div>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
