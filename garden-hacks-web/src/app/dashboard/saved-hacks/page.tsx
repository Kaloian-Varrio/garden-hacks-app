import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardSavedHacks } from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "Saved Hacks",
};

export const dynamic = "force-dynamic";

export default async function SavedHacksPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const savedHacks = await getDashboardSavedHacks(user.id);

  return (
    <div className="rounded-lg border border-[#dfe8d8] bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
        Saved Hacks
      </h1>
      <p className="mt-2 text-sm text-[#59655c]">
        Ideas you saved for later reading and testing.
      </p>

      {savedHacks.length > 0 ? (
        <div className="mt-6 grid gap-4">
          {savedHacks.map((savedHack) => (
            <div
              key={savedHack.id}
              className="rounded-lg border border-[#edf2e8] bg-[#f8faf7] p-4"
            >
              <h2 className="text-xl font-black text-[#18231c]">
                {savedHack.hack.title}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-[#405046]">
                <span className="rounded-md bg-white px-2.5 py-1 font-semibold">
                  {savedHack.hack.group}
                </span>
                <span className="rounded-md bg-white px-2.5 py-1 font-semibold">
                  {savedHack.hack.category}
                </span>
                <span className="rounded-md bg-white px-2.5 py-1 font-semibold">
                  Score {savedHack.hack.ratingScore}
                </span>
              </div>
              <Link
                href={`/hacks/${savedHack.hack.slug}`}
                className="mt-4 inline-flex text-sm font-bold text-[#2f6f3e] hover:text-[#203525]"
              >
                View details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="No saved hacks yet"
            message="Saved hacks will appear here after you save public gardening ideas."
            actionHref="/hacks"
            actionLabel="Browse hacks"
          />
        </div>
      )}
    </div>
  );
}
