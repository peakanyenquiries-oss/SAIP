"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;

  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "ghost";

  fullWidth?: boolean;

  loading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {

  const variants = {

    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    secondary:
      "bg-slate-600 hover:bg-slate-700 text-white",

    success:
      "bg-green-600 hover:bg-green-700 text-white",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",

    ghost:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100",

  };

  return (

    <button

      {...props}

      disabled={disabled || loading}

      className={`

        inline-flex

        items-center

        justify-center

        gap-2

        rounded-xl

        px-5

        py-3

        text-sm

        font-semibold

        transition-all

        duration-200

        disabled:cursor-not-allowed

        disabled:opacity-60

        ${variants[variant]}

        ${fullWidth ? "w-full" : ""}

        ${className}

      `}

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

            className="opacity-20"

          />

          <path

            fill="currentColor"

            d="M22 12a10 10 0 00-10-10v4a6 6 0 016 6h4z"

          />

        </svg>

      )}

      {children}

    </button>

  );

}