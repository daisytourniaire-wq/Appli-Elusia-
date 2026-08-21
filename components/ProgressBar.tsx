export function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-xs text-elusia-muted">
        <span>
          Étape {Math.min(step, total)} / {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-elusia-line">
        <div
          className="h-full rounded-full bg-elusia-clay transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
