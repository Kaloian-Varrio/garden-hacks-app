import Image from "next/image";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardOverview } from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const authUser = await getCurrentUser();

  if (!authUser) {
    redirect("/login");
  }

  const overview = await getDashboardOverview(authUser.id);

  if (!overview) {
    redirect("/login");
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-[#dfe8d8] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-[#dfe8d8] bg-[#edf5e9]">
            {overview.user.photoUrl ? (
              <Image
                src={overview.user.photoUrl}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-black text-[#2f6f3e]">
                {overview.user.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#4f7f40]">
              Dashboard overview
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-[#18231c]">
              Welcome, {overview.user.name}
            </h1>
            <p className="mt-2 text-sm text-[#59655c]">{overview.user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          label="Points balance"
          value={overview.stats.pointsBalance}
        />
        <DashboardStatCard
          label="Published hacks"
          value={overview.stats.publishedHacks}
        />
        <DashboardStatCard
          label="Joined groups"
          value={overview.stats.joinedGroups}
        />
        <DashboardStatCard label="Saved hacks" value={overview.stats.savedHacks} />
      </div>

      <div className="rounded-lg border border-[#dfe8d8] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-normal text-[#18231c]">
              Recent activity
            </h2>
            <p className="mt-2 text-sm text-[#59655c]">
              Points earned from publishing and community reactions.
            </p>
          </div>
          <Button href="/dashboard/hacks/new">Create hack</Button>
        </div>
        {overview.recentActivity.length > 0 ? (
          <div className="mt-5 grid gap-3">
            {overview.recentActivity.map((item) => (
              <div
                key={item.id}
                className="grid gap-2 rounded-lg border border-[#edf2e8] bg-[#f8faf7] p-4 sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-bold text-[#18231c]">
                    {formatReason(item.reason)}
                  </p>
                  <p className="mt-1 text-sm text-[#59655c]">
                    {item.hackTitle ?? "Account activity"} ·{" "}
                    {formatDate(item.createdAt)}
                  </p>
                </div>
                <p className="text-lg font-black text-[#2f6f3e]">
                  +{item.points}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState
              title="No activity yet"
              message="Publish your first gardening hack to start earning points."
              actionHref="/dashboard/hacks/new"
              actionLabel="Create hack"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function formatReason(reason: string) {
  return reason
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
