export default function AIWidget() {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-indigo-700 via-blue-700 to-slate-900 p-8 text-white shadow-lg">

      <div className="flex items-center gap-4">

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl">

          🤖

        </div>

        <div>

          <h2 className="text-2xl font-bold">

            SAIP AI Assistant

          </h2>

          <p className="text-blue-100">

            Enterprise Intelligence

          </p>

        </div>

      </div>

      <div className="mt-8 space-y-4">

        <div className="rounded-xl bg-white/10 p-4">

          Good morning Administrator.

        </div>

        <div className="rounded-xl bg-white/10 p-4">

          Customer growth increased by 12%.

        </div>

        <div className="rounded-xl bg-white/10 p-4">

          Inventory is running low on Oil Filters.

        </div>

        <div className="rounded-xl bg-white/10 p-4">

          Two quotations require approval.

        </div>

      </div>

      <button className="mt-8 w-full rounded-xl bg-white py-4 font-bold text-blue-700 transition hover:bg-blue-50">

        Open AI Assistant

      </button>

    </div>
  );
}