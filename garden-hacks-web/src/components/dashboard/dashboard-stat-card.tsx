export function DashboardStatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="garden-card p-5">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#0f766e]">
        {label}
      </p>
      <p className="mt-2 break-words text-3xl font-black text-[#10231c]">
        {value}
      </p>
    </div>
  );
}
