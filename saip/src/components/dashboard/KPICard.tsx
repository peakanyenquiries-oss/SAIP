"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  description: string;
}

export default function KPICard({
  title,
  value,
  change,
  description,
}: KPICardProps) {
  const positive = change >= 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <h2 className="mt-4 text-5xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>

        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
            positive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {positive ? (
            <TrendingUp size={28} />
          ) : (
            <TrendingDown size={28} />
          )}
        </div>

      </div>

      <div className="mt-8 flex items-center justify-between">

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            positive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {positive ? "+" : ""}
          {change}%
        </span>

        <span className="text-sm text-slate-500">
          {description}
        </span>

      </div>

    </div>
  );
}