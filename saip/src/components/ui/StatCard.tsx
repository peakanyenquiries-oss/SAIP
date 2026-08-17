"use client";

import { ReactNode } from "react";
import Card from "./Card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  subtitle?: string;
  trend?: string;
  color?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  color = "blue",
}: StatCardProps) {

  const colors: Record<string, string> = {

    blue:
      "text-blue-600 bg-blue-100",

    green:
      "text-green-600 bg-green-100",

    red:
      "text-red-600 bg-red-100",

    yellow:
      "text-yellow-600 bg-yellow-100",

    purple:
      "text-purple-600 bg-purple-100",

    slate:
      "text-slate-600 bg-slate-100",

    indigo:
      "text-indigo-600 bg-indigo-100",

    emerald:
      "text-emerald-600 bg-emerald-100",

    amber:
      "text-amber-600 bg-amber-100",

    "text-blue-600":
      "text-blue-600 bg-blue-100",

    "text-green-600":
      "text-green-600 bg-green-100",

    "text-red-600":
      "text-red-600 bg-red-100",

    "text-yellow-600":
      "text-yellow-600 bg-yellow-100",

    "text-purple-600":
      "text-purple-600 bg-purple-100",

    "text-slate-600":
      "text-slate-600 bg-slate-100",

    "text-indigo-600":
      "text-indigo-600 bg-indigo-100",

    "text-emerald-600":
      "text-emerald-600 bg-emerald-100",

    "text-amber-500":
      "text-amber-600 bg-amber-100",

    "text-amber-600":
      "text-amber-600 bg-amber-100",

  };

  const badgeColor =
    colors[color] ?? colors.blue;

  return (

    <Card>

      <div className="flex items-start justify-between">

        <div className="flex-1">

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}

          {trend && (
            <p className="mt-2 text-xs font-semibold text-green-600">
              {trend}
            </p>
          )}

        </div>

        {icon && (

          <div
            className={`
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              ${badgeColor}
            `}
          >
            {icon}
          </div>

        )}

      </div>

    </Card>

  );

}