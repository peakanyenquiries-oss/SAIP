"use client";

import { ReactNode } from "react";
import Card from "./Card";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function SectionCard({
  title,
  subtitle,
  action,
  children,
}: SectionCardProps) {
  return (
    <Card>

      <div className="mb-6 flex items-start justify-between">

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}

        </div>

        {action}

      </div>

      {children}

    </Card>
  );
}