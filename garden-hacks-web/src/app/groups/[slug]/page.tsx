import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GroupMembershipButton } from "@/components/garden/group-membership-button";
import { HackCard } from "@/components/garden/hack-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getPublicGroupBySlug } from "@/lib/public-data/queries";

type GroupDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: GroupDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const group = await getPublicGroupBySlug(slug);

  return {
    title: group?.title ?? "Group details",
    description: group?.description ?? "Garden Hacks group details.",
  };
}

export default async function GroupDetailsPage({
  params,
}: GroupDetailsPageProps) {
  const user = await getCurrentUser();
  const { slug } = await params;
  const group = await getPublicGroupBySlug(slug, user?.id);

  if (!group) {
    notFound();
  }

  const isMember = Boolean(group.viewerMembership);
  const isManager = group.viewerMembership?.groupRole === "manager";

  return (
    <div>
      <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#dfe8d8] bg-[#dfe8d8]">
            <Image
              src={
                group.imageUrl ??
                "https://placehold.co/1200x800/e8f5dc/31572c/png?text=Garden+Group"
              }
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <Badge tone="green">Gardening group</Badge>
            <h1 className="mt-5 text-4xl font-black tracking-normal text-[#18231c] sm:text-5xl">
              {group.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#59655c]">
              {group.description}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
              <Metric label="Members" value={group.membersCount} />
              <Metric label="Published hacks" value={group.hacksCount} />
            </div>
            <div className="mt-7 max-w-sm">
              {user ? (
                <GroupMembershipButton
                  groupId={group.id}
                  isMember={isMember}
                  isManager={isManager}
                />
              ) : (
                <div className="rounded-lg border border-[#dfe8d8] bg-[#f8faf7] p-4">
                  <p className="text-sm leading-6 text-[#59655c]">
                    Login or register to join this group and publish hacks with
                    its community.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button href="/login">Login</Button>
                    <Button href="/register" variant="secondary">
                      Register
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[320px_1fr]">
          <aside className="h-fit rounded-lg border border-[#dfe8d8] bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black text-[#18231c]">
              Group managers
            </h2>
            {group.managers.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {group.managers.map((manager) => (
                  <div key={manager.id} className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-[#edf5e9]">
                      {manager.photoUrl ? (
                        <Image
                          src={manager.photoUrl}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm font-black text-[#2f6f3e]">
                          {manager.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-bold text-[#203525]">
                      {manager.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-[#59655c]">
                Managers will appear here when assigned.
              </p>
            )}
          </aside>

          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-black tracking-normal text-[#18231c]">
                  Published hacks
                </h2>
                <p className="mt-2 text-sm text-[#59655c]">
                  Ideas shared by this group community.
                </p>
              </div>
              {isMember ? (
                <Button href="/dashboard/hacks/new">Publish a hack</Button>
              ) : null}
            </div>
            {group.hacks.length > 0 ? (
              <div className="mt-6 grid gap-5">
                {group.hacks.map((hack) => (
                  <HackCard key={hack.id} hack={hack} />
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState
                  title="No published hacks yet"
                  message="This group is ready for its first public gardening hack."
                  actionHref={user ? "/dashboard/hacks/new" : "/login"}
                  actionLabel={user ? "Create hack" : "Login to contribute"}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <Link href="/groups" className="text-sm font-bold text-[#2f6f3e]">
          Back to all groups
        </Link>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[#dfe8d8] bg-[#f8faf7] p-4">
      <p className="text-2xl font-black text-[#18231c]">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#59655c]">
        {label}
      </p>
    </div>
  );
}
