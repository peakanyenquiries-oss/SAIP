interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: "blue" | "green" | "orange" | "red" | "purple";
}

export default function StatCard({
  title,
  value,
  subtitle,
  color = "blue",
}: StatCardProps) {
  const colors = {
    blue: "from-blue-600 to-blue-800",
    green: "from-green-600 to-green-800",
    orange: "from-orange-500 to-orange-700",
    red: "from-red-600 to-red-800",
    purple: "from-purple-600 to-purple-800",
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">

      <div className={`h-2 bg-gradient-to-r ${colors[color]}`} />

      <div className="p-7">

        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          {title}
        </p>

        <h2 className="mt-4 text-5xl font-bold text-slate-900">
          {value}
        </h2>

        {subtitle && (
          <p className="mt-3 text-sm text-slate-500">
            {subtitle}
          </p>
        )}

      </div>

    </div>
  );
}