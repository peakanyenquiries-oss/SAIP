"use client";

import { Customer } from "@/types/customer";
import EnterpriseTable, {
  Column,
} from "@/components/tables/EnterpriseTable";

interface CustomerTableProps {
  customers: Customer[];
  loading?: boolean;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

function StatusBadge({
  status,
}: {
  status: Customer["status"];
}) {
  const isActive = status === "Active";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isActive
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      <span
        className={`mr-2 h-2 w-2 rounded-full ${
          isActive ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />

      {status}
    </span>
  );
}

function CustomerInitials({
  customer,
}: {
  customer: Customer;
}) {
  const first =
    customer.firstName?.charAt(0)?.toUpperCase() ?? "";

  const last =
    customer.lastName?.charAt(0)?.toUpperCase() ?? "";

  const initials = `${first}${last}` || "?";

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
      {initials}
    </div>
  );
}

export default function CustomerTable({
  customers,
  loading = false,
  onView,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  const columns: Column<Customer>[] = [
    {
      key: "firstName",
      title: "Customer",
      width: "24%",
      render: (customer) => (
        <div className="flex items-center gap-3">
          <CustomerInitials customer={customer} />

          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">
              {customer.firstName} {customer.lastName}
            </p>

            <p className="truncate text-xs text-slate-500">
              {customer.company || "Individual Customer"}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "email",
      title: "Contact",
      width: "24%",
      render: (customer) => (
        <div>
          <p className="truncate text-sm text-slate-700">
            {customer.email || "No email"}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {customer.phone || "No phone"}
          </p>
        </div>
      ),
    },

    {
      key: "city",
      title: "Location",
      width: "16%",
      render: (customer) => (
        <div>
          <p className="font-medium text-slate-700">
            {customer.city || "—"}
          </p>

          <p className="text-xs text-slate-500">
            {customer.province || ""}
          </p>
        </div>
      ),
    },

    {
      key: "status",
      title: "Status",
      width: "14%",
      render: (customer) => (
        <StatusBadge status={customer.status} />
      ),
    },

    {
      key: "actions",
      title: "Actions",
      width: "22%",
      render: (customer) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(customer)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            View
          </button>

          <button
            type="button"
            onClick={() => onEdit(customer)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(customer)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <EnterpriseTable
      columns={columns}
      data={customers}
      loading={loading}
      emptyMessage="No customers found. Add your first customer to begin building your CRM."
    />
  );
}