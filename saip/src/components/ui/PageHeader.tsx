"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  icon,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

      <div>

        <div className="flex items-center gap-3">

          {icon}

          <h1 className="text-4xl font-bold text-slate-800">
            {title}
          </h1>

        </div>

        {subtitle && (
          <p className="mt-3 text-slate-500">
            {subtitle}
          </p>
        )}

      </div>

      {actions && (
        <div className="flex gap-3">
          {actions}
        </div>
      )}

    </div>
  );
}