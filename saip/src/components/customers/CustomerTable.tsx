"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getCustomers,
  deleteCustomer,
} from "@/services/customerService";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  province: string | null;
  status: string;
}

export default function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadCustomers() {
    setLoading(true);

    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  async function removeCustomer(id: string) {
    const confirmed = window.confirm(
      "Delete this customer?"
    );

    if (!confirmed) return;

    await deleteCustomer(id);

    loadCustomers();
  }

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchValue = search.toLowerCase();

      return (
        customer.first_name
          .toLowerCase()
          .includes(searchValue) ||
        customer.last_name
          .toLowerCase()
          .includes(searchValue) ||
        (customer.company ?? "")
          .toLowerCase()
          .includes(searchValue) ||
        (customer.email ?? "")
          .toLowerCase()
          .includes(searchValue)
      );
    });
  }, [customers, search]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="text-2xl font-semibold text-slate-900">
            Customers
          </h2>

          <p className="mt-1 text-slate-500">
            Manage your customer database.
          </p>

        </div>

        <input
          placeholder="Search customers..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none lg:w-80"
        />

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Customer
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Company
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Email
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Phone
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Province
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-6 py-4 text-right text-sm font-semibold">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading && (

              <tr>

                <td
                  colSpan={7}
                  className="py-12 text-center text-slate-500"
                >
                  Loading customers...
                </td>

              </tr>

            )}

            {!loading &&
              filteredCustomers.length === 0 && (

                <tr>

                  <td
                    colSpan={7}
                    className="py-12 text-center text-slate-500"
                  >
                    No customers found.
                  </td>

                </tr>

              )}

            {!loading &&
              filteredCustomers.map((customer) => (

                <tr
                  key={customer.id}
                  className="border-t border-slate-200 hover:bg-slate-50"
                >

                  <td className="px-6 py-5">

                    <div>

                      <p className="font-semibold">

                        {customer.first_name}{" "}
                        {customer.last_name}

                      </p>

                    </div>

                  </td>

                  <td className="px-6 py-5">

                    {customer.company || "-"}

                  </td>

                  <td className="px-6 py-5">

                    {customer.email || "-"}

                  </td>

                  <td className="px-6 py-5">

                    {customer.phone || "-"}

                  </td>

                  <td className="px-6 py-5">

                    {customer.province || "-"}

                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        customer.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {customer.status}
                    </span>

                  </td>

                  <td className="px-6 py-5 text-right">

                    <div className="flex justify-end gap-2">

                      <button
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
                      >
                        View
                      </button>

                      <button
                        className="rounded-lg bg-blue-700 px-4 py-2 text-sm text-white hover:bg-blue-800"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          removeCustomer(customer.id)
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}