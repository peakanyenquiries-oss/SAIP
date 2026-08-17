"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface QuickActionProps {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
}

export default function QuickAction({
  title,
  description,
  href,
  icon,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-600 hover:shadow-lg"
    >

      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">

        {icon}

      </div>

      <h3 className="font-bold text-slate-800">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>

    </Link>
  );
}