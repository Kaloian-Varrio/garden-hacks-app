import Link from "next/link";
import { HackTagLink } from "@/components/garden/hack-tag-link";
import { HackVisual } from "@/components/garden/hack-visual";
import { HackVotePanel } from "@/components/garden/hack-vote-panel";
import { SaveHackButton } from "@/components/garden/save-hack-button";
import { Card } from "@/components/ui/card";
import { CommentIcon, SparkIcon } from "@/components/ui/garden-icons";
import type { PublicHack } from "@/lib/public-data/types";

export function HackCard({
  hack,
  isLoggedIn,
}: {
  hack: PublicHack;
  isLoggedIn: boolean;
}) {
  return (
    <Card className="grid overflow-hidden sm:grid-cols-[260px_1fr]">
      <HackVisual
        category={hack.category}
        className="min-h-64 rounded-none sm:min-h-full"
        imageUrl={hack.imageUrl}
        title={hack.title}
      />
      <div className="flex flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-black tracking-tight text-[#10231c]">
            <Link
              href={`/hacks/${hack.slug}`}
              className="garden-focus rounded-lg hover:text-[#0f766e]"
            >
              {hack.title}
            </Link>
          </h3>
          <SaveHackButton
            compact
            hackId={hack.id}
            initialIsSaved={hack.isSaved}
            isLoggedIn={isLoggedIn}
          />
        </div>
        <p className="mt-3 text-sm leading-6 text-[#59655c]">{hack.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <HackTagLink param="tag" value={hack.category}>
            {hack.category}
          </HackTagLink>
          <HackTagLink param="group" value={hack.group} tone="sky">
            {hack.group}
          </HackTagLink>
          <HackTagLink param="difficulty" value={hack.difficulty} tone="slate">
            {hack.difficulty}
          </HackTagLink>
        </div>
        <p className="mt-4 text-sm font-semibold text-[#405046]">
          By {hack.author}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <span className="rounded-md bg-[#fff8e1] px-2.5 py-1.5 font-semibold text-[#6a4a08]">
            <SparkIcon className="mr-1 inline" size={15} />
            Rating {hack.ratingScore}
          </span>
          <span className="rounded-md bg-[#eef8fd] px-2.5 py-1.5 font-semibold text-[#17536a]">
            <CommentIcon className="mr-1 inline" size={15} />
            {hack.commentsCount} comments
          </span>
        </div>
        <HackVotePanel
          compact
          hackId={hack.id}
          initialUserVote={hack.userVote}
          initialSweetTomatoesCount={hack.sweetTomatoesCount}
          initialBitterCucumbersCount={hack.bitterCucumbersCount}
          initialRatingScore={hack.ratingScore}
          isLoggedIn={isLoggedIn}
        />
        <Link
          href={`/hacks/${hack.slug}`}
          className="garden-focus mt-5 w-fit rounded-full text-sm font-black text-[#0f766e] hover:text-[#f0643c]"
        >
          Read hack details
        </Link>
      </div>
    </Card>
  );
}
