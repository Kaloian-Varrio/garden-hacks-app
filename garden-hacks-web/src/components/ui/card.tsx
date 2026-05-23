import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`rounded-lg border border-[#dfe8d8] bg-white shadow-sm ${className}`}
    >
      {children}
    </article>
  );
}
