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
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#4f7f40]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-3xl font-bold tracking-normal text-[#18231c] sm:text-4xl">
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
