import type { Metadata } from "next";
import { SectionTitle } from "@/components/ui/section-title";

export const metadata: Metadata = {
  title: "About",
};

const sections = [
  {
    title: "What Garden Hacks App is",
    text: "Garden Hacks App is a community-driven platform for sharing sustainable, organic, and regenerative gardening practices. It helps people discover practical ideas, compare real experiences, and learn from growers with similar spaces and challenges.",
  },
  {
    title: "Why sustainable gardening matters",
    text: "Sustainable gardening protects soil, reduces waste, saves water, and supports the living systems that make food growing possible. Small habits like composting, mulching, and choosing resilient planting plans can make a garden more productive and less fragile.",
  },
  {
    title: "Why chemical-free gardening is important",
    text: "Chemical-free practices reduce exposure for families, pets, pollinators, and soil organisms. The app encourages prevention, biodiversity, organic matter, and careful observation before stronger interventions are considered.",
  },
  {
    title: "Gardening and mental wellbeing",
    text: "Gardening gives people a steady rhythm, time outdoors, and visible progress. Caring for plants can lower stress, create a sense of agency, and turn everyday spaces into places of recovery and attention.",
  },
  {
    title: "Learning from real-life tested experience",
    text: "The community helps separate hopeful theory from practical results. Members can publish hacks, comment on what worked, vote on usefulness, and build shared knowledge from gardens that are imperfect, local, and real.",
  },
];

export default function AboutPage() {
  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionTitle eyebrow="About" title="Grow better by learning together">
          Garden Hacks is built around the idea that healthier food starts with
          healthier soil, honest community knowledge, and practical care.
        </SectionTitle>
        <div className="mt-10 grid gap-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-lg border border-[#dfe8d8] bg-white p-6 sm:p-8"
            >
              <h2 className="text-2xl font-black tracking-normal text-[#18231c]">
                {section.title}
              </h2>
              <p className="mt-4 text-base leading-8 text-[#59655c]">
                {section.text}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
