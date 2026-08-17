const customers = [
  {
    name: "John Smith",
    company: "ABC Logistics",
  },
  {
    name: "Sarah Johnson",
    company: "Johnson Auto",
  },
  {
    name: "Peter Williams",
    company: "Fleet Masters",
  },
  {
    name: "David Brown",
    company: "Brown Transport",
  },
];

export default function RecentCustomers() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <h2 className="mb-8 text-2xl font-bold">

        Recent Customers

      </h2>

      <div className="space-y-5">

        {customers.map((customer) => (

          <div
            key={customer.name}
            className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
          >

            <div>

              <h3 className="font-bold">

                {customer.name}

              </h3>

              <p className="text-sm text-slate-500">

                {customer.company}

              </p>

            </div>

            <button className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">

              View

            </button>

          </div>

        ))}

      </div>

    </div>
  );
}