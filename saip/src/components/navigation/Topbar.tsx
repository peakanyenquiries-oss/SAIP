"use client";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between border-b bg-white px-10 py-6 shadow-sm">

      {/* Left */}

      <div>

        <h1 className="text-4xl font-bold text-slate-900">

          Dashboard

        </h1>

        <p className="mt-2 text-slate-500">

          South African Automotive Intelligence Platform

        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Search */}

        <input
          type="text"
          placeholder="Search customers, products, suppliers..."
          className="w-96 rounded-xl border border-slate-300 px-5 py-3 outline-none focus:border-blue-700"
        />

        {/* Notifications */}

        <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl hover:bg-blue-100">

          🔔

        </button>

        {/* Messages */}

        <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl hover:bg-blue-100">

          ✉

        </button>

        {/* Settings */}

        <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl hover:bg-blue-100">

          ⚙

        </button>

        {/* User */}

        <div className="flex items-center gap-3">

          <div>

            <p className="font-semibold">

              Administrator

            </p>

            <p className="text-sm text-slate-500">

              System Owner

            </p>

          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 font-bold text-white">

            A

          </div>

        </div>

      </div>

    </header>
  );
}