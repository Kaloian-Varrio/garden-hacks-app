import type { Metadata } from "next";
import { GroupCard } from "@/components/garden/group-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/section-title";
import { getPublicGroups } from "@/lib/public-data/queries";

export const metadata: Metadata = {
  title: "Groups",
};

export default async function GroupsPage() {
  const groups = await getPublicGroups();

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Garden communities" title="Explore groups">
          Visitors can browse public groups and learn what each community is
          growing. Joining groups will be available after login.
        </SectionTitle>

        <div className="mt-8 flex justify-center">
          <Button href="/login" variant="secondary">
            Login to join groups
          </Button>
        </div>

        {groups.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <div key={group.id} id={group.slug} className="scroll-mt-24">
                <GroupCard group={group} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              title="No public groups yet"
              message="Seed the database or add public groups to show gardening communities here."
            />
          </div>
        )}
      </div>
    </div>
  );
}
