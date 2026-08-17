"use client";

import { Customer } from "@/types/customer";

interface CustomerProfileProps {
  customer: Customer;
  onClose: () => void;
}

export default function CustomerProfile({
  customer,
  onClose,
}: CustomerProfileProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-3xl rounded-xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-3xl font-bold">
            Customer Profile
          </h2>

          <button
            onClick={onClose}
            className="rounded bg-red-600 px-4 py-2 text-white"
          >
            Close
          </button>

        </div>

        <div className="grid gap-6 p-8 md:grid-cols-2">

          <div>

            <h3 className="mb-2 text-xl font-bold">
              Personal Information
            </h3>

            <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
            <p><strong>Company:</strong> {customer.company}</p>
            <p><strong>Email:</strong> {customer.email}</p>
            <p><strong>Phone:</strong> {customer.phone}</p>

          </div>

          <div>

            <h3 className="mb-2 text-xl font-bold">
              Address
            </h3>

            <p>{customer.address}</p>
            <p>{customer.city}</p>
            <p>{customer.province}</p>

          </div>

          <div className="md:col-span-2">

            <h3 className="mb-2 text-xl font-bold">
              Notes
            </h3>

            <div className="rounded bg-slate-100 p-4">

              {customer.notes || "No notes available."}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}