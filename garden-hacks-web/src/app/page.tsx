import Image from "next/image";
import type { ReactNode } from "react";
import { GroupCard } from "@/components/garden/group-card";
import { HackCard } from "@/components/garden/hack-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CucumberIcon,
  LightbulbIcon,
  SparkIcon,
  SproutIcon,
  TomatoIcon,
} from "@/components/ui/garden-icons";
import { SectionTitle } from "@/components/ui/section-title";
import { getCurrentUser } from "@/lib/auth/session";
import { getPublicGroups, getPublicHacks } from "@/lib/public-data/queries";

export default async function Home() {
  const currentUser = await getCurrentUser();
  const [groups, hacks] = await Promise.all([
    getPublicGroups(3),
    getPublicHacks(3, currentUser?.id),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/garden-hacks-hero.png"
            alt="A warm modern home vegetable garden with clever gardening hacks"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f5fffb]/96 via-[#f5fffb]/84 to-[#f5fffb]/30" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f2fbf7] to-transparent" />
        </div>
        <div className="mx-auto min-h-[calc(100vh-5rem)] max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid min-h-[calc(100vh-11rem)] items-center">
            <div className="max-w-3xl">
              <Badge tone="amber">Smart gardening tricks</Badge>
              <h1 className="mt-6 text-5xl font-black tracking-tight text-[#10231c] sm:text-6xl lg:text-7xl">
                Garden Hacks
                <span className="garden-gradient-text block">
                  for clever growers.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#405046] sm:text-xl">
                Practical, low-fuss ideas for vegetables, soil, water, pests,
                compost, and cozy outdoor living, shared by people who actually
                try them.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/hacks">Browse Hacks</Button>
                <Button href="/register" variant="secondary">
                  Join the Community
                </Button>
              </div>
              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <HeroStat icon={<LightbulbIcon />} label="Lazy-smart ideas" />
                <HeroStat icon={<SproutIcon />} label="Healthy home gardens" />
                <HeroStat icon={<TomatoIcon />} label="Community-tested tips" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Why it matters"
          title="Grow food with fewer chemicals and more confidence"
        >
          Garden Hacks helps beginners and experienced growers compare simple
          ideas, learn from community feedback, and build gardens that protect
          soil life, water, pollinators, and people.
        </SectionTitle>
      </section>

      <section className="bg-white/55 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle eyebrow="Groups" title="Featured gardening groups">
            Join thematic spaces for vegetables, composting, small spaces,
            herbs, soil regeneration, water saving, and seasonal planning.
          </SectionTitle>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle eyebrow="Hacks" title="Featured community hacks">
            Browse practical ideas for compost, tomatoes, living soil, herbs,
            pest prevention, and water-smart growing.
          </SectionTitle>
          <div className="mt-10 grid gap-5">
            {hacks.map((hack) => (
              <HackCard
                key={hack.id}
                hack={hack}
                isLoggedIn={Boolean(currentUser)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#10382f] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#5bd8d0]">
              Community voting
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              Sweet Tomatoes and Bitter Cucumbers
            </h2>
            <p className="mt-4 leading-7 text-[#d8f3e8]">
              Sweet Tomatoes are positive votes for hacks that feel useful,
              clear, and worth trying. Bitter Cucumbers are careful negative
              votes for ideas that need more detail, caution, or improvement.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <VotingExplainer icon={<TomatoIcon />} title="Sweet" copy="Encourages practical, helpful ideas." />
            <VotingExplainer icon={<CucumberIcon />} title="Bitter" copy="Flags gaps, risks, or unclear advice." />
            <VotingExplainer icon={<SparkIcon />} title="Score" copy="Sweet Tomatoes minus Bitter Cucumbers." />
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="garden-shell mx-auto max-w-5xl rounded-3xl p-6 sm:p-8">
          <h2 className="text-3xl font-black tracking-tight text-[#10231c]">
            Chemical-free and regenerative by default
          </h2>
          <p className="mt-4 text-base leading-7 text-[#59655c]">
            The project favors practices that feed soil life, reduce waste, save
            water, and avoid synthetic additives. It is designed for people who
            want healthier food and a calmer relationship with the land they
            care for.
          </p>
        </div>
      </section>
    </div>
  );
}

function HeroStat({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="garden-shell flex items-center gap-3 rounded-2xl p-4 text-sm font-black text-[#134c40]">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0f9f93] shadow-sm">
        {icon}
      </span>
      {label}
    </div>
  );
}

function VotingExplainer({
  copy,
  icon,
  title,
}: {
  copy: string;
  icon?: ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-3xl bg-white/95 p-5 text-[#10231c] shadow-xl shadow-emerald-950/10">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dff8e9] text-[#0f766e]">
        {icon}
      </div>
      <p className="text-3xl font-black text-[#0f766e]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#59655c]">{copy}</p>
    </div>
  );
}
