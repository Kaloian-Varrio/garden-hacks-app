import Image from "next/image";
import { GroupCard } from "@/components/garden/group-card";
import { HackCard } from "@/components/garden/hack-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/section-title";
import { getPublicGroups, getPublicHacks } from "@/lib/public-data/queries";

export default async function Home() {
  const [groups, hacks] = await Promise.all([
    getPublicGroups(3),
    getPublicHacks(3),
  ]);

  return (
    <div>
      <section className="bg-[#edf5e9]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:items-center lg:px-8 lg:py-16">
          <div>
            <Badge tone="amber">Sustainable gardening community</Badge>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-normal text-[#18231c] sm:text-5xl lg:text-6xl">
              Garden Hacks App
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#405046]">
              A community platform for sustainable, organic, and regenerative
              gardening hacks shared by people who test them in real gardens,
              balconies, and small food-growing spaces.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/hacks">Browse Hacks</Button>
              <Button href="/register" variant="secondary">
                Join the Community
              </Button>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-[#405046] sm:grid-cols-3">
              <p className="rounded-lg border border-[#cbd9c2] bg-white/70 p-4 font-semibold">
                Real-life tested practices
              </p>
              <p className="rounded-lg border border-[#cbd9c2] bg-white/70 p-4 font-semibold">
                Chemical-free growing
              </p>
              <p className="rounded-lg border border-[#cbd9c2] bg-white/70 p-4 font-semibold">
                Regenerative habits
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#cbd9c2] bg-white shadow-sm">
            <Image
              src="https://placehold.co/1400x1050/e8f5dc/31572c/png?text=Community+Garden+Hacks"
              alt="Fresh vegetables, seedlings, and garden notes"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
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

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
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
              <HackCard key={hack.id} hack={hack} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#203525] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#a9d49b]">
              Community voting
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-normal">
              Sweet Tomatoes and Bitter Cucumbers
            </h2>
            <p className="mt-4 leading-7 text-[#d8e6d1]">
              Sweet Tomatoes are positive votes for hacks that feel useful,
              clear, and worth trying. Bitter Cucumbers are careful negative
              votes for ideas that need more detail, caution, or improvement.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-5 text-[#18231c]">
              <p className="text-3xl font-black text-[#a13723]">Sweet</p>
              <p className="mt-2 text-sm leading-6 text-[#59655c]">
                Encourages practical, helpful ideas.
              </p>
            </div>
            <div className="rounded-lg bg-white p-5 text-[#18231c]">
              <p className="text-3xl font-black text-[#285d35]">Bitter</p>
              <p className="mt-2 text-sm leading-6 text-[#59655c]">
                Flags gaps, risks, or unclear advice.
              </p>
            </div>
            <div className="rounded-lg bg-white p-5 text-[#18231c]">
              <p className="text-3xl font-black text-[#6a4a08]">Score</p>
              <p className="mt-2 text-sm leading-6 text-[#59655c]">
                Sweet Tomatoes minus Bitter Cucumbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-lg border border-[#dfe8d8] bg-white p-6 sm:p-8">
          <h2 className="text-3xl font-black tracking-normal text-[#18231c]">
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
