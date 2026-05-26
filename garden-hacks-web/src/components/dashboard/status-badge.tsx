const statusClasses = {
  draft: "border-[#d7e7df] bg-white/75 text-[#435047]",
  published: "garden-badge-category",
  archived: "garden-badge-featured",
};

export function StatusBadge({
  status,
}: {
  status: "draft" | "published" | "archived";
}) {
  return (
    <span
      className={`garden-badge ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}
