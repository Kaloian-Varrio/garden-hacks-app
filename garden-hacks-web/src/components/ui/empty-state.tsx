import { Button } from "./button";

export function EmptyState({
  title,
  message,
  actionHref,
  actionLabel,
}: {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-[#cbd9c2] bg-white px-6 py-12 text-center">
      <h3 className="text-xl font-bold text-[#18231c]">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#59655c]">
        {message}
      </p>
      {actionHref && actionLabel ? (
        <Button href={actionHref} className="mt-6">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
