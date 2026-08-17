"use client";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface DeleteSupplierDialogProps {
  open: boolean;
  supplierName: string;
  onCancel: () => void;
  onDelete: () => void;
}

export default function DeleteSupplierDialog({
  open,
  supplierName,
  onCancel,
  onDelete,
}: DeleteSupplierDialogProps) {
  return (
    <Modal
      open={open}
      title="Delete Supplier"
      onClose={onCancel}
    >
      <div className="space-y-6">

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">

          <h3 className="text-lg font-semibold text-red-700">
            Confirm Deletion
          </h3>

          <p className="mt-2 text-slate-700">
            You are about to permanently delete the supplier:
          </p>

          <p className="mt-3 text-xl font-bold text-slate-900">
            {supplierName}
          </p>

          <p className="mt-4 text-sm text-red-600">
            This action cannot be undone.
          </p>

        </div>

        <div className="flex justify-end gap-3">

          <Button
            variant="ghost"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={onDelete}
          >
            Delete Supplier
          </Button>

        </div>

      </div>
    </Modal>
  );
}