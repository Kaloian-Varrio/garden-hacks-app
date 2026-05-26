import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getUserGroupDetail } from "@/lib/groups/queries";
import type { GroupMemberItem } from "@/lib/groups/types";

type GroupDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Group details",
    description: "Garden Hacks group details.",
  };
}

export default async function GroupDetailsPage({
  params,
}: GroupDetailsPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const groupId = Number(id);

  if (!Number.isInteger(groupId) || groupId <= 0) {
    notFound();
  }

  const group = await getUserGroupDetail(user, groupId);

  if (group === "not-found") {
    notFound();
  }

  if (group === "access-denied") {
    return <AccessDenied />;
  }

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
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#2f6f3e]">
              Role: {group.viewerRole}
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-normal text-[#18231c] sm:text-5xl">
              {group.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#59655c]">
              {group.description}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
              <Metric label="Members" value={group.membersCount} />
              <Metric label="Published hacks" value={group.hacksCount} />
            </div>
            {group.canManage ? (
              <div className="mt-7 flex flex-wrap gap-2">
                <Link
                  href={`/groups/${group.id}/edit`}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#b7c8ad] bg-white px-5 py-2.5 text-sm font-semibold text-[#203525] hover:bg-[#f1f7ed]"
                >
                  Edit
                </Link>
                <Link
                  href={`/groups/${group.id}/delete`}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#efb5a8] bg-white px-5 py-2.5 text-sm font-semibold text-[#8a2d1c] hover:bg-[#fff0eb]"
                >
                  Delete
                </Link>
                <Link
                  href="#members"
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#2f6f3e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#285d35]"
                >
                  Manage Members
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[340px_1fr]">
          <aside className="space-y-5">
            <PeoplePanel title="Group managers" people={group.managers} />
            <PeoplePanel id="members" title="Group members" people={group.members} />
          </aside>

          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-black tracking-normal text-[#18231c]">
                  Group hacks
                </h2>
                <p className="mt-2 text-sm text-[#59655c]">
                  Published ideas shared inside this group.
                </p>
              </div>
              {group.viewerIsMember ? (
                <Link
                  href={`/groups/${group.id}/hacks/new`}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#2f6f3e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#285d35]"
                >
                  Create Hack
                </Link>
              ) : null}
            </div>

            {group.hacks.length > 0 ? (
              <div className="mt-6 grid gap-4">
                {group.hacks.map((hack) => (
                  <article
                    key={hack.id}
                    className="rounded-lg border border-[#dfe8d8] bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-xl font-black text-[#18231c]">
                          <Link
                            href={`/hacks/${hack.slug}`}
                            className="hover:text-[#2f6f3e]"
                          >
                            {hack.title}
                          </Link>
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[#59655c]">
                          {hack.excerpt}
                        </p>
                        <p className="mt-3 text-sm font-semibold text-[#405046]">
                          By {hack.author} · {hack.category} · {hack.difficulty}
                          <span className="block pt-1 text-[#59655c]">
                            Status: {hack.status} · Created {formatDate(hack.createdAt)}
                          </span>
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <Link
                          href={`/hacks/${hack.slug}`}
                          className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#b7c8ad] bg-white px-3 py-2 text-sm font-semibold text-[#203525] hover:bg-[#f1f7ed]"
                        >
                          View
                        </Link>
                        {hack.canManage ? (
                          <>
                            <Link
                              href={`/groups/${group.id}/hacks/${hack.id}/edit`}
                              className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#b7c8ad] bg-white px-3 py-2 text-sm font-semibold text-[#203525] hover:bg-[#f1f7ed]"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/groups/${group.id}/hacks/${hack.id}/delete`}
                              className="inline-flex min-h-10 items-center justify-center rounded-md border border-[#efb5a8] bg-white px-3 py-2 text-sm font-semibold text-[#8a2d1c] hover:bg-[#fff0eb]"
                            >
                              Delete
                            </Link>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                      <Stat label="Sweet" value={hack.sweetTomatoesCount} />
                      <Stat label="Bitter" value={hack.bitterCucumbersCount} />
                      <Stat label="Score" value={hack.ratingScore} />
                      <Stat label="Comments" value={hack.commentsCount} />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <EmptyState
                  title="No group hacks yet"
                  message="This group is ready for its first published gardening hack."
                  actionHref={
                    group.viewerIsMember ? `/groups/${group.id}/hacks/new` : undefined
                  }
                  actionLabel={group.viewerIsMember ? "Create hack" : undefined}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <Link href="/groups" className="text-sm font-bold text-[#2f6f3e]">
          Back to my groups
        </Link>
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-lg border border-[#dfe8d8] bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-black tracking-normal text-[#18231c]">
          Access denied
        </h1>
        <p className="mt-3 leading-7 text-[#59655c]">
          You can view group details only for groups where you are a member.
        </p>
        <Link
          href="/groups"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-[#2f6f3e] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#285d35]"
        >
          Back to my groups
        </Link>
      </div>
    </div>
  );
}

function PeoplePanel({
  id,
  people,
  title,
}: {
  id?: string;
  people: GroupMemberItem[];
  title: string;
}) {
  return (
    <div
      id={id}
      className="scroll-mt-24 rounded-lg border border-[#dfe8d8] bg-white p-5 shadow-sm"
    >
      <h2 className="text-xl font-black text-[#18231c]">{title}</h2>
      {people.length > 0 ? (
        <div className="mt-4 grid gap-3">
          {people.map((person) => (
            <div key={`${title}-${person.id}`} className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-md bg-[#edf5e9]">
                {person.photoUrl ? (
                  <Image
                    src={person.photoUrl}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-black text-[#2f6f3e]">
                    {person.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-[#203525]">
                  {person.name}
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6c786f]">
                  {person.groupRole}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 text-[#59655c]">
          No people to show yet.
        </p>
      )}
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded-md bg-[#f8faf7] px-3 py-2 font-semibold text-[#405046]">
      {label}: <span className="text-[#18231c]">{value}</span>
    </span>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
