"use client";

import {
  Bell,
  Search,
  Menu,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";

interface TopNavbarProps {
  onMenuClick: () => void;
}

export default function TopNavbar({
  onMenuClick,
}: TopNavbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg border border-slate-200 p-2 hover:bg-slate-100"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-800">
            SAIP Enterprise
          </h1>

          <p className="text-xs text-slate-500">
            South African Automotive Intelligence Platform
          </p>
        </div>
      </div>

      <div className="hidden w-full max-w-md lg:flex">
        <div className="relative w-full">
          <Search
            size={18}
            className="absolute left-3 top-3 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search suppliers, products, vehicles..."
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 hover:bg-slate-100">
          <Bell size={20} />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button className="rounded-lg p-2 hover:bg-slate-100">
          <Settings size={20} />
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">
          <UserCircle
            size={36}
            className="text-blue-600"
          />

          <div className="hidden md:block">
            <p className="font-semibold text-slate-800">
              Administrator
            </p>

            <p className="text-xs text-slate-500">
              admin@saip.co.za
            </p>
          </div>
        </div>

        <button className="rounded-lg p-2 text-red-600 hover:bg-red-50">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}