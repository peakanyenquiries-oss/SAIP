"use client";

import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">

      <div className="mb-5 text-slate-300">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-slate-700">
        {title}
      </h3>

      {description && (
        <p className="mt-3 max-w-md text-slate-500">
          {description}
        </p>
      )}

    </div>
  );
}