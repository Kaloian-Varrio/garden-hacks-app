import type { ReactNode } from "react";

type BadgeTone =
  | "green"
  | "amber"
  | "tomato"
  | "sky"
  | "slate"
  | "category"
  | "status"
  | "featured"
  | "admin";

const toneClasses: Record<BadgeTone, string> = {
  green: "garden-badge-category",
  amber: "garden-badge-featured",
  tomato: "garden-badge-admin",
  sky: "garden-badge-status",
  slate: "border-[#d7e7df] bg-white/75 text-[#405046]",
  category: "garden-badge-category",
  status: "garden-badge-status",
  featured: "garden-badge-featured",
  admin: "garden-badge-admin",
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
      className={`garden-badge shadow-sm ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
