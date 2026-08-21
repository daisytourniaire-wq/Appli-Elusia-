export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card">
      <p className="text-xs font-medium uppercase tracking-wide text-elusia-muted">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl text-elusia-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-elusia-muted">{hint}</p>}
    </div>
  );
}
