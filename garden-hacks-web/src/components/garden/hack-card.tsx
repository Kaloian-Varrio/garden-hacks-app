import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { PublicHack } from "@/lib/public-data/types";

export function HackCard({ hack }: { hack: PublicHack }) {
  return (
    <Card className="grid overflow-hidden sm:grid-cols-[240px_1fr]">
      <div className="relative min-h-56 bg-[#dfe8d8] sm:min-h-full">
        <Image
          src={hack.imageUrl ?? "https://placehold.co/1200x800/e8f5dc/31572c/png?text=Garden+Hack"}
          alt=""
          fill
          sizes="(min-width: 1024px) 240px, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col p-5">
        <div className="flex flex-wrap gap-2">
          <Badge>{hack.category}</Badge>
          <Badge tone="sky">{hack.group}</Badge>
          <Badge tone="slate">{hack.difficulty}</Badge>
        </div>
        <h3 className="mt-4 text-2xl font-bold text-[#18231c]">
          <Link href={`/hacks/${hack.slug}`} className="hover:text-[#2f6f3e]">
            {hack.title}
          </Link>
        </h3>
        <p className="mt-3 text-sm leading-6 text-[#59655c]">{hack.excerpt}</p>
        <p className="mt-4 text-sm font-semibold text-[#405046]">
          By {hack.author}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          <span className="rounded-md bg-[#fff0eb] px-3 py-2 font-semibold text-[#8a2d1c]">
            {hack.sweetTomatoesCount} Sweet
          </span>
          <span className="rounded-md bg-[#edf5e9] px-3 py-2 font-semibold text-[#285d35]">
            {hack.bitterCucumbersCount} Bitter
          </span>
          <span className="rounded-md bg-[#fff8e1] px-3 py-2 font-semibold text-[#6a4a08]">
            Score {hack.ratingScore}
          </span>
          <span className="rounded-md bg-[#eef8fd] px-3 py-2 font-semibold text-[#17536a]">
            {hack.commentsCount} comments
          </span>
        </div>
        <Link
          href={`/hacks/${hack.slug}`}
          className="mt-5 text-sm font-bold text-[#2f6f3e] hover:text-[#203525]"
        >
          Read hack details
        </Link>
      </div>
    </Card>
  );
}
