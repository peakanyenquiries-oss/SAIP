"use client";

interface ProgressBarProps {
  value: number;
}

export default function ProgressBar({
  value,
}: ProgressBarProps) {
  const width = Math.min(
    Math.max(value, 0),
    100
  );

  let color = "bg-red-500";

  if (width >= 80) {
    color = "bg-emerald-500";
  } else if (width >= 60) {
    color = "bg-amber-500";
  }

  return (
    <div className="flex items-center gap-3">

      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">

        <div
          className={`h-full ${color}`}
          style={{
            width: `${width}%`,
          }}
        />

      </div>

      <span className="w-10 text-right text-sm font-semibold">
        {width}%
      </span>

    </div>
  );
}