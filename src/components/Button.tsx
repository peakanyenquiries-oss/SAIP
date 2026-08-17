"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "success";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const styles = {
    primary:
      "bg-blue-700 hover:bg-blue-800 text-white shadow-md",

    secondary:
      "bg-slate-800 hover:bg-slate-900 text-white shadow-md",

    ghost:
      "border border-slate-300 bg-white hover:bg-slate-100 text-slate-700",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",

    success:
      "bg-emerald-600 hover:bg-emerald-700 text-white",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "active:scale-95",
        fullWidth && "w-full",
        styles[variant],
        className
      )}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            opacity="0.25"
          />

          <path
            d="M22 12a10 10 0 00-10-10"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      )}

      {children}
    </button>
  );
}