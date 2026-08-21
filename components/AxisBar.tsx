export function AxisBar({
  label,
  percent,
  highlighted,
}: {
  label: string;
  percent: number;
  highlighted?: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className={highlighted ? "font-medium text-elusia-ink" : "text-elusia-muted"}>
          {label}
        </span>
        <span className="text-xs text-elusia-muted">{percent}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-elusia-line">
        <div
          className={`h-full rounded-full ${
            highlighted ? "bg-elusia-clay" : "bg-elusia-sage"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
