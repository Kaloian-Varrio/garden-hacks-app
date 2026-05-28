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
    <div className="relative px-4 py-12 sm:px-6 lg:px-8 overflow-hidden min-h-screen">
      <div
        className="absolute inset-0 z-0 opacity-10 bg-[url('/images/garden-bg.webp')] md:bg-[url('https://images.unsplash.com/photo-1466692476877-339242ea0120?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-fixed pointer-events-none"
        style={{ mixBlendMode: 'multiply' }}
      />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <SectionTitle eyebrow="About" title="Grow better by learning together">
            Garden Hacks is built around the idea that healthier food starts with
            healthier soil, honest community knowledge, and practical care.
          </SectionTitle>
          <p className="mt-6 text-xl text-[#2a4d3e] font-medium leading-relaxed italic">
            "A healthy spirit in a healthy body begins with natural, clean food. For a fuller, more beautiful longevity with Garden Hacks."
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <section
              key={section.title}
              className="group rounded-2xl border border-[#dfe8d8]/80 bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-[#F27830]/30 hover:translate-y-[-2px] flex flex-col"
            >
              <h2 className="text-xl sm:text-2xl font-black tracking-normal text-[#18231c] leading-tight mb-4">
                {section.title}
              </h2>
              <p className="text-base leading-relaxed text-[#59655c] flex-grow">
                {section.text}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
