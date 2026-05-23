import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-lg border border-[#dfe8d8] bg-white p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#4f7f40]">
            Protected area
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-normal text-[#18231c]">
            Welcome, {user.name}
          </h1>
          <p className="mt-4 text-base leading-7 text-[#59655c]">
            Your dashboard shell is protected by a JWT session stored in a
            secure HTTP-only cookie. The full dashboard experience will be built
            in the next task.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <DashboardStat label="Role" value={user.role} />
            <DashboardStat label="Points balance" value={user.pointsBalance} />
            <DashboardStat label="Email" value={user.email} />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/hacks">Browse hacks</Button>
            <Button href="/groups" variant="secondary">
              Explore groups
            </Button>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-[#dfe8d8] bg-[#f8faf7] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#59655c]">
        {label}
      </p>
      <p className="mt-2 break-words text-lg font-black text-[#18231c]">
        {value}
      </p>
    </div>
  );
}
