import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardUsersForAdmin } from "@/lib/dashboard/queries";
import { AddUserButton, UserActions } from "@/components/dashboard/user-management-actions";

export const metadata: Metadata = {
  title: "Users Management",
};

export default async function DashboardUsersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  const { totalUsers, users } = await getDashboardUsersForAdmin();

  return (
    <div className="rounded-lg border border-[#dfe8d8] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
            Users Management
          </h1>
          <p className="mt-2 text-sm text-[#59655c]">
            Admin-only overview of registered Garden Hacks users.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#e9fbef] px-4 py-3 text-sm font-black text-[#134c40]">
            Total users: {totalUsers}
          </div>
          <AddUserButton />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-[#edf2e8]">
        <table className="min-w-full divide-y divide-[#edf2e8] text-left text-sm">
          <thead className="bg-[#f8faf7] text-xs font-black uppercase tracking-[0.12em] text-[#59655c]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Points</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#edf2e8]">
            {users.map((dashboardUser) => (
              <tr key={dashboardUser.id} className="bg-white">
                <td className="px-4 py-3 font-bold text-[#18231c]">
                  {dashboardUser.name}
                </td>
                <td className="px-4 py-3 text-[#405046]">
                  {dashboardUser.email}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-[#eef8fd] px-2.5 py-1 text-xs font-black text-[#17536a]">
                    {dashboardUser.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#405046]">
                  {dashboardUser.pointsBalance}
                </td>
                <td className="px-4 py-3 text-[#405046]">
                  {dashboardUser.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <UserActions userId={dashboardUser.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
