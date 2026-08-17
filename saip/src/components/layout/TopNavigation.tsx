"use client";

export default function TopNavigation() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">

      {/* Left */}

      <div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          SAIP Enterprise
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          South African Automotive Intelligence Platform
        </p>

      </div>

      {/* Center */}

      <div className="hidden w-full max-w-xl px-10 lg:block">

        <input
          type="text"
          placeholder="Search customers, suppliers, products, vehicles..."
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-5 py-3 outline-none transition focus:border-blue-700 focus:bg-white"
        />

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        <button className="relative rounded-xl border border-slate-300 bg-white p-3 hover:bg-slate-100">

          🔔

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>

        </button>

        <button className="rounded-xl border border-slate-300 bg-white p-3 hover:bg-slate-100">
          🌙
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-700 text-lg font-bold text-white">
            A
          </div>

          <div>

            <p className="text-sm font-semibold text-slate-900">
              Administrator
            </p>

            <p className="text-xs text-slate-500">
              Enterprise Admin
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}