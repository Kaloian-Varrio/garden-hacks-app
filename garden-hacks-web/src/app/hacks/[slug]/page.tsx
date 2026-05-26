import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { HackComments } from "@/components/garden/hack-comments";
import { HackVisual } from "@/components/garden/hack-visual";
import { HackVotePanel } from "@/components/garden/hack-vote-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommentIcon, SparkIcon, TomatoIcon, CucumberIcon } from "@/components/ui/garden-icons";
import { getCurrentUser } from "@/lib/auth/session";
import { getPublicHackBySlug } from "@/lib/public-data/queries";

type HackDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: HackDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const hack = await getPublicHackBySlug(slug);

  return {
    title: hack?.title ?? "Hack details",
    description: hack?.excerpt ?? "Public Garden Hacks App detail page.",
  };
}

export default async function HackDetailsPage({ params }: HackDetailsPageProps) {
  const { slug } = await params;
  const currentUser = await getCurrentUser();
  const hack = await getPublicHackBySlug(slug, currentUser ?? undefined);

  if (!hack) {
    notFound();
  }

  const canModerateGroupComments = hack.viewerGroupRole === "manager";
  const comments = hack.comments.map((comment) => ({
    id: comment.id,
    text: comment.text,
    authorName: comment.authorName,
    createdAt: comment.createdAt?.toISOString() ?? null,
    updatedAt: comment.updatedAt?.toISOString() ?? null,
    canEdit:
      currentUser?.role === "admin" || currentUser?.id === comment.authorId,
    canDelete:
      currentUser?.role === "admin" ||
      currentUser?.id === comment.authorId ||
      canModerateGroupComments,
  }));

  return (
    <article>
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <HackVisual
            category={hack.category}
            className="garden-shell aspect-[4/3]"
            imageUrl={hack.imageUrl}
            title={hack.title}
          />
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>{hack.category}</Badge>
              <Badge tone="sky">{hack.group}</Badge>
              <Badge tone="slate">{hack.difficulty}</Badge>
              {hack.isOrganic ? <Badge tone="green">Organic</Badge> : null}
              {hack.isChemicalFree ? (
                <Badge tone="amber">Chemical-free</Badge>
              ) : null}
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-[#10231c] sm:text-6xl">
              {hack.title}
            </h1>
            <p className="mt-4 text-base font-semibold text-[#405046]">
              By {hack.author} in{" "}
              <Link href={`/groups/${hack.groupId}`} className="text-[#2f6f3e]">
                {hack.group}
              </Link>
            </p>
            <p className="mt-5 text-lg leading-8 text-[#59655c]">
              {hack.excerpt}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric icon={<TomatoIcon />} label="Sweet Tomatoes" value={hack.sweetTomatoesCount} />
              <Metric icon={<CucumberIcon />} label="Bitter Cucumbers" value={hack.bitterCucumbersCount} />
              <Metric icon={<SparkIcon />} label="Rating" value={hack.ratingScore} />
              <Metric icon={<CommentIcon />} label="Comments" value={hack.commentsCount} />
            </div>
            <HackVotePanel
              hackId={hack.id}
              initialUserVote={hack.userVote}
              initialSweetTomatoesCount={hack.sweetTomatoesCount}
              initialBitterCucumbersCount={hack.bitterCucumbersCount}
              initialRatingScore={hack.ratingScore}
              isLoggedIn={Boolean(currentUser)}
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div
          className={`mx-auto grid max-w-7xl gap-8 ${
            !currentUser ? "lg:grid-cols-[1fr_360px]" : ""
          }`}
        >
          <div className="space-y-8">
            <div className="garden-shell rounded-3xl p-6 sm:p-8">
              <h2 className="text-2xl font-black tracking-tight text-[#10231c]">
                The hack
              </h2>
              <p className="mt-5 whitespace-pre-line text-base leading-8 text-[#405046]">
                {hack.content}
              </p>
            </div>

            <HackComments
              hackId={hack.id}
              comments={comments}
              isLoggedIn={Boolean(currentUser)}
            />
          </div>

          {!currentUser && (
            <aside className="space-y-5">
              <div className="rounded-lg border border-[#dfe8d8] bg-white p-5">
                <h2 className="text-lg font-black text-[#18231c]">
                  Join to interact
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#59655c]">
                  Login or register to vote with Sweet Tomatoes or Bitter
                  Cucumbers, like, comment, save hacks, and earn community points.
                </p>
                <div className="mt-5 grid gap-2">
                  <Button href="/login">Login</Button>
                  <Button href="/register" variant="secondary">
                    Register
                  </Button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </section>
    </article>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl border border-[#d9eee4] bg-white/78 p-4 shadow-sm">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-[#dff8e9] text-[#0f766e]">
        {icon}
      </div>
      <p className="text-3xl font-black text-[#10231c]">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#59655c]">
        {label}
      </p>
    </div>
  );
}
