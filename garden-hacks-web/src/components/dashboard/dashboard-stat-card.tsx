export function DashboardStatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-[#dfe8d8] bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#59655c]">
        {label}
      </p>
      <p className="mt-2 break-words text-3xl font-black text-[#18231c]">
        {value}
      </p>
    </div>
  );
}
