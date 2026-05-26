import type { ReactNode } from "react";

export function SectionTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0f766e]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-3xl font-black tracking-tight text-[#10231c] sm:text-5xl">
        {title}
      </h2>
      {children ? (
        <p className="mt-4 text-base leading-7 text-[#59655c] sm:text-lg">
          {children}
        </p>
      ) : null}
    </div>
  );
}
