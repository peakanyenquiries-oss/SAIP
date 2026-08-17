"use client";

const actions = [
  {
    title: "New Customer",
    description: "Create a customer profile",
    color: "bg-blue-600",
    icon: "👥",
  },
  {
    title: "New Supplier",
    description: "Register a supplier",
    color: "bg-green-600",
    icon: "🏭",
  },
  {
    title: "New Product",
    description: "Add a product",
    color: "bg-orange-500",
    icon: "📦",
  },
  {
    title: "Vehicle Database",
    description: "Search vehicles",
    color: "bg-purple-600",
    icon: "🚗",
  },
  {
    title: "Create Quote",
    description: "Generate quotation",
    color: "bg-cyan-600",
    icon: "🧾",
  },
  {
    title: "Inventory",
    description: "Manage stock",
    color: "bg-red-600",
    icon: "📋",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="mb-8 text-2xl font-bold text-slate-900">
        Quick Actions
      </h2>

      <div className="grid gap-5 md:grid-cols-2">

        {actions.map((action) => (

          <button
            key={action.title}
            className="group rounded-2xl border border-slate-200 p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
          >

            <div
              className={`flex h-14 w-14 items-center justify-center rounded-xl text-2xl text-white ${action.color}`}
            >
              {action.icon}
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              {action.title}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {action.description}
            </p>

          </button>

        ))}

      </div>

    </div>
  );
}