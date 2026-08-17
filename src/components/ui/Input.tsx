"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">

        {label && (
          <label className="block text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}

        <input
          ref={ref}
          {...props}
          className={clsx(
            "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition",
            "focus:border-blue-600 focus:ring-2 focus:ring-blue-100",
            error &&
              "border-red-500 focus:ring-red-100",
            className
          )}
        />

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;