import { ReactNode } from "react";
import Sidebar from "@/components/navigation/Sidebar";
import Topbar from "@/components/Topbar";

interface LayoutProps {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Topbar />

        <main className="flex-1 p-8">

          {children}

        </main>

      </div>

    </div>
  );
}