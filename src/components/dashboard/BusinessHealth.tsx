const health = [
  {
    title: "Customers",
    value: 96,
    color: "bg-blue-600",
  },
  {
    title: "Suppliers",
    value: 89,
    color: "bg-green-600",
  },
  {
    title: "Inventory",
    value: 92,
    color: "bg-orange-500",
  },
  {
    title: "Sales",
    value: 98,
    color: "bg-purple-600",
  },
];

export default function BusinessHealth() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">

      <h2 className="mb-8 text-2xl font-bold text-slate-900">
        Business Health
      </h2>

      <div className="space-y-6">

        {health.map((item) => (

          <div key={item.title}>

            <div className="mb-2 flex justify-between">

              <span className="font-semibold">
                {item.title}
              </span>

              <span className="font-bold">
                {item.value}%
              </span>

            </div>

            <div className="h-3 rounded-full bg-slate-200">

              <div
                className={`${item.color} h-3 rounded-full`}
                style={{
                  width: `${item.value}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}