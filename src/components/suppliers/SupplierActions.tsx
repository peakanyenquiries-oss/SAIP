"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

interface SupplierActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function SupplierActions({
  onView,
  onEdit,
  onDelete,
}: SupplierActionsProps) {
  return (
    <div className="flex items-center justify-center gap-2">

      <button
        onClick={onView}
        className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
        title="View Supplier"
      >
        <Eye size={18} />
      </button>

      <button
        onClick={onEdit}
        className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-amber-600"
        title="Edit Supplier"
      >
        <Pencil size={18} />
      </button>

      <button
        onClick={onDelete}
        className="rounded-lg p-2 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        title="Delete Supplier"
      >
        <Trash2 size={18} />
      </button>

    </div>
  );
}