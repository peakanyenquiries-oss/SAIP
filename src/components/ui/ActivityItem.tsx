"use client";

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  color?:
    | "blue"
    | "green"
    | "red"
    | "yellow";
}

export default function ActivityItem({
  title,
  description,
  time,
  color = "blue",
}: ActivityItemProps) {

  const colors = {
    blue: "bg-blue-600",
    green: "bg-emerald-600",
    red: "bg-red-600",
    yellow: "bg-amber-500",
  };

  return (
    <div className="flex gap-4">

      <div
        className={`mt-2 h-3 w-3 rounded-full ${colors[color]}`}
      />

      <div className="flex-1">

        <div className="flex items-center justify-between">

          <h4 className="font-semibold text-slate-800">
            {title}
          </h4>

          <span className="text-xs text-slate-400">
            {time}
          </span>

        </div>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}