import type { ReactNode } from "react";

type CardVariant =
  | "standard"
  | "interactive"
  | "hack"
  | "comment"
  | "admin"
  | "glass";

const variantClasses: Record<CardVariant, string> = {
  standard: "garden-card",
  interactive: "garden-card garden-card-interactive",
  hack: "garden-card garden-card-hack garden-card-interactive",
  comment: "garden-card-comment",
  admin: "garden-card-admin",
  glass: "garden-card-glass",
};

export function Card({
  children,
  className = "",
  variant = "glass",
}: {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
}) {
  return (
    <article
      className={`${variantClasses[variant]} ${className}`}
    >
      {children}
    </article>
  );
}
