export function StatsCard({
  label,
  value,
  icon,
  trend,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-1 text-2xl font-bold text-accent">{value}</p>
          {trend && (
            <p className="mt-1 text-xs text-muted">{trend}</p>
          )}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}
