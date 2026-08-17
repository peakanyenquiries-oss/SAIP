const suppliers = [
  {
    name: "Goldwagen",
    score: 98,
    status: "Excellent",
  },
  {
    name: "Masterparts",
    score: 95,
    status: "Excellent",
  },
  {
    name: "Alert Engine Parts",
    score: 92,
    status: "Very Good",
  },
  {
    name: "Midas",
    score: 89,
    status: "Good",
  },
];

export default function SupplierLeaderboard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-slate-900">
          Supplier Leaderboard
        </h2>

        <button className="font-semibold text-blue-700 hover:underline">
          View All
        </button>

      </div>

      <div className="space-y-5">

        {suppliers.map((supplier, index) => (

          <div
            key={supplier.name}
            className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
          >

            <div className="flex items-center gap-4">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 font-bold text-white">

                {index + 1}

              </div>

              <div>

                <h3 className="font-bold text-slate-900">

                  {supplier.name}

                </h3>

                <p className="text-sm text-slate-500">

                  {supplier.status}

                </p>

              </div>

            </div>

            <div className="text-right">

              <p className="text-2xl font-bold text-green-600">

                {supplier.score}%

              </p>

              <p className="text-sm text-slate-500">

                Supplier Score

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}