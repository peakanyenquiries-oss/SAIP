"use client";

import { ReactNode } from "react";

export type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "secondary"
  | "info"
  | "purple";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant | string;
  rounded?: boolean;
  className?: string;
}

export default function Badge({
  children,
  variant = "primary",
  rounded = true,
  className = "",
}: BadgeProps) {

  const variants: Record<string, string> = {

    primary:
      "bg-blue-100 text-blue-700",

    success:
      "bg-green-100 text-green-700",

    warning:
      "bg-yellow-100 text-yellow-700",

    danger:
      "bg-red-100 text-red-700",

    secondary:
      "bg-slate-200 text-slate-700",

    info:
      "bg-cyan-100 text-cyan-700",

    purple:
      "bg-purple-100 text-purple-700",

  };

  const badgeStyle =
    variants[variant] ??
    variants.primary;

  return (

    <span
      className={`
        inline-flex
        items-center
        justify-center
        px-3
        py-1
        text-xs
        font-semibold
        ${rounded ? "rounded-full" : "rounded-lg"}
        ${badgeStyle}
        ${className}
      `}
    >

      {children}

    </span>

  );

}