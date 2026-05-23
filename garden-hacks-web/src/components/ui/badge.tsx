import type { ReactNode } from "react";

type BadgeTone = "green" | "amber" | "tomato" | "sky" | "slate";

const toneClasses: Record<BadgeTone, string> = {
  green: "border-[#b8d6ad] bg-[#ecf7e8] text-[#285d35]",
  amber: "border-[#e9cf8d] bg-[#fff8e1] text-[#6a4a08]",
  tomato: "border-[#efb5a8] bg-[#fff0eb] text-[#8a2d1c]",
  sky: "border-[#b8d7e8] bg-[#eef8fd] text-[#17536a]",
  slate: "border-[#d6d9d2] bg-white text-[#435047]",
};

export function Badge({
  children,
  tone = "green",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
