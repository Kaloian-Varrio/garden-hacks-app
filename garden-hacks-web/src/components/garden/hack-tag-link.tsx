import Link from "next/link";
import type { ReactNode } from "react";

type HackTagLinkProps = {
  children: ReactNode;
  param: "tag" | "group" | "difficulty";
  value: string;
  tone?: "green" | "sky" | "slate" | "amber";
};

const toneClasses = {
  green: "border-[#b7e7d1] bg-[#e9fbef] text-[#134c40] hover:bg-[#dff8e9]",
  sky: "border-[#bfeaf0] bg-[#eef8fd] text-[#17536a] hover:bg-[#dff7fb]",
  slate: "border-[#d7e7df] bg-white/85 text-[#405046] hover:bg-[#f4fbf7]",
  amber: "border-[#ffd69a] bg-[#fff8e1] text-[#6a4a08] hover:bg-[#fff0c7]",
};

export function HackTagLink({
  children,
  param,
  value,
  tone = "green",
}: HackTagLinkProps) {
  const href = `/hacks?${param}=${encodeURIComponent(value)}`;

  return (
    <Link
      href={href}
      className={`garden-focus inline-flex items-center rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.08em] shadow-sm transition ${toneClasses[tone]}`}
    >
      {children}
    </Link>
  );
}

