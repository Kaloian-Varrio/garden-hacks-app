import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HackComments } from "@/components/garden/hack-comments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const hack = await getPublicHackBySlug(slug, currentUser?.id);

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
      <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#dfe8d8] bg-[#dfe8d8]">
            <Image
              src={hack.imageUrl ?? "https://placehold.co/1200x800/e8f5dc/31572c/png?text=Garden+Hack"}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
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
            <h1 className="mt-5 text-4xl font-black tracking-normal text-[#18231c] sm:text-5xl">
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
              <Metric label="Sweet Tomatoes" value={hack.sweetTomatoesCount} />
              <Metric label="Bitter Cucumbers" value={hack.bitterCucumbersCount} />
              <Metric label="Rating score" value={hack.ratingScore} />
              <Metric label="Comments" value={hack.commentsCount} />
            </div>
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
            <div className="rounded-lg border border-[#dfe8d8] bg-white p-6 sm:p-8">
              <h2 className="text-2xl font-black tracking-normal text-[#18231c]">
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
