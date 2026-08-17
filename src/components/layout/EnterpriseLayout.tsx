"use client";

import { ReactNode } from "react";

import Sidebar from "@/components/navigation/Sidebar";
import TopNavigation from "@/components/layout/TopNavigation";

interface EnterpriseLayoutProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

export default function EnterpriseLayout({
  children,
}: EnterpriseLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-100">

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">

        <TopNavigation />

        <main className="flex-1 overflow-y-auto p-8">

          {children}

        </main>

      </div>

    </div>
  );
}