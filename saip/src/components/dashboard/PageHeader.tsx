interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({
  title,
  subtitle,
}: PageHeaderProps) {
  return (
    <div className="mb-10 flex items-center justify-between">

      <div>

        <h1 className="text-5xl font-black text-slate-900">
          {title}
        </h1>

        <p className="mt-2 text-lg text-slate-500">
          {subtitle}
        </p>

      </div>

      <div className="rounded-xl bg-white px-6 py-4 shadow">

        <p className="text-sm text-slate-500">
          Enterprise Version
        </p>

        <h3 className="text-2xl font-bold text-blue-700">
          SAIP v0.2
        </h3>

      </div>

    </div>
  );
}