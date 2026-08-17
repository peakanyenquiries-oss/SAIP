"use client";

import {
  Bell,
  Search,
  UserCircle,
} from "lucide-react";

export default function Topbar() {

  return (

    <header className="flex h-20 items-center justify-between border-b bg-white px-8">

      <div className="relative w-full max-w-lg">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search anything..."
          className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-600"
        />

      </div>

      <div className="flex items-center gap-6">

        <button className="rounded-xl p-2 hover:bg-slate-100">
          <Bell size={22} />
        </button>

        <div className="flex items-center gap-3">

          <UserCircle
            size={36}
            className="text-slate-700"
          />

          <div>

            <p className="font-semibold">
              Administrator
            </p>

            <p className="text-sm text-slate-500">
              SAIP Enterprise
            </p>

          </div>

        </div>

      </div>

    </header>

  );

}