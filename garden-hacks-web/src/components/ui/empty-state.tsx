import { Button } from "./button";
import { SproutIcon } from "./garden-icons";

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
    <div className="garden-shell rounded-3xl border-dashed px-6 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dff8e9] text-[#176b49]">
        <SproutIcon size={28} />
      </div>
      <h3 className="mt-5 text-xl font-black text-[#10231c]">{title}</h3>
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
