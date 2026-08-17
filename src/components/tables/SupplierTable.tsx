"use client";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { Supplier } from "@/types/supplier";

interface SupplierTableProps {
  suppliers: Supplier[];
  loading: boolean;
  onView: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export default function SupplierTable({
  suppliers,
  loading,
  onView,
  onEdit,
  onDelete,
}: SupplierTableProps) {
  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        Loading suppliers...
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="py-20 text-center text-slate-500">
        No suppliers found.
      </div>
    );
  }

  function scoreColor(score: number) {
    if (score >= 85)
      return "bg-green-100 text-green-700";

    if (score >= 70)
      return "bg-blue-100 text-blue-700";

    if (score >= 50)
      return "bg-yellow-100 text-yellow-700";

    return "bg-red-100 text-red-700";
  }

  function statusColor(status: string) {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";

      case "Inactive":
        return "bg-gray-100 text-gray-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-5 py-4 text-left text-sm font-semibold">
              Company
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold">
              Contact Person
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold">
              Phone
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold">
              Province
            </th>

            <th className="px-5 py-4 text-left text-sm font-semibold">
              Payment Terms
            </th>

            <th className="px-5 py-4 text-center text-sm font-semibold">
              Score
            </th>

            <th className="px-5 py-4 text-center text-sm font-semibold">
              Status
            </th>

            <th className="px-5 py-4 text-center text-sm font-semibold">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {suppliers.map((supplier) => (

            <tr
              key={supplier.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="px-5 py-4 font-semibold">
                {supplier.company}
              </td>

              <td className="px-5 py-4">
                {supplier.contactPerson || "-"}
              </td>

              <td className="px-5 py-4">
                {supplier.phone || "-"}
              </td>

              <td className="px-5 py-4">
                {supplier.province || "-"}
              </td>

              <td className="px-5 py-4">
                {supplier.paymentTerms || "-"}
              </td>

              <td className="px-5 py-4 text-center">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${scoreColor(
                    supplier.supplierScore
                  )}`}
                >
                  {supplier.supplierScore}/100
                </span>

              </td>

              <td className="px-5 py-4 text-center">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                    supplier.status
                  )}`}
                >
                  {supplier.status}
                </span>

              </td>

              <td className="px-5 py-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onView(supplier)}
                    className="rounded-lg bg-slate-100 p-2 hover:bg-slate-200"
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    onClick={() => onEdit(supplier)}
                    className="rounded-lg bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    onClick={() => onDelete(supplier)}
                    className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200"
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}