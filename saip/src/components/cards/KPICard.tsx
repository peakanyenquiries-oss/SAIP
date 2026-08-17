interface KPICardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon,
  color = "bg-blue-700",
}: KPICardProps) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-4 text-5xl font-black text-slate-900">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-4 text-sm text-slate-400">
              {subtitle}
            </p>
          )}

        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl text-white ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}