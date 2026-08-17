"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Truck,
  Users,
  Boxes,
  Car,
  Warehouse,
  FileText,
  ClipboardList,
  ShoppingCart,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  open,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();

  const menu = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "Suppliers",
      icon: Truck,
      href: "/suppliers",
    },
    {
      title: "Products",
      icon: Boxes,
      href: "/products",
    },
    {
      title: "Vehicles",
      icon: Car,
      href: "/vehicles",
    },
    {
      title: "Customers",
      icon: Users,
      href: "/customers",
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      href: "/orders",
    },
    {
      title: "Purchasing",
      icon: ClipboardList,
      href: "/purchasing",
    },
    {
      title: "Reports",
      icon: BarChart3,
      href: "/reports",
    },
    {
      title: "Documents",
      icon: FileText,
      href: "/documents",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ];

  return (
    <aside
      className={`relative flex min-h-screen flex-col bg-slate-900 text-white transition-all duration-300 ${
        open ? "w-72" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 p-5">
        {open && (
          <div>
            <h1 className="text-xl font-bold">
              SAIP
            </h1>

            <p className="text-xs text-slate-400">
              Enterprise Edition
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onToggle}
          className="rounded-lg bg-slate-800 p-2 hover:bg-slate-700"
          aria-label={
            open
              ? "Collapse sidebar"
              : "Expand sidebar"
          }
        >
          {open ? (
            <ChevronLeft size={18} />
          ) : (
            <ChevronRight size={18} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1 px-3">
        {menu.map((item) => {
          const active =
            pathname === item.href;

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-2 flex items-center rounded-xl px-4 py-3 transition-all ${
                active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />

              {open && (
                <span className="ml-4 font-medium">
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {open && (
        <div className="border-t border-slate-800 p-5">
          <p className="text-xs text-slate-400">
            South African Automotive
          </p>

          <p className="text-sm font-semibold">
            Intelligence Platform
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Enterprise v1.0
          </p>
        </div>
      )}
    </aside>
  );
}