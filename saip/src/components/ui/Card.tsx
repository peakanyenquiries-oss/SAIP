"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
}

export default function Card({
  children,
  className = "",
  title,
  subtitle,
  footer,
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-shadow
        duration-200
        hover:shadow-md
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="border-b border-slate-200 px-6 py-4">
          {title && (
            <h2 className="text-lg font-semibold text-slate-800">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="p-6">
        {children}
      </div>

      {footer && (
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
}