const statusClasses = {
  draft: "border-[#d6d9d2] bg-white text-[#435047]",
  published: "border-[#b8d6ad] bg-[#ecf7e8] text-[#285d35]",
  archived: "border-[#e9cf8d] bg-[#fff8e1] text-[#6a4a08]",
};

export function StatusBadge({
  status,
}: {
  status: "draft" | "published" | "archived";
}) {
  return (
    <span
      className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-bold ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}
