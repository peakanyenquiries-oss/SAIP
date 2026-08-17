"use client";

import Button from "@/components/ui/Button";

interface Props {

  open: boolean;

  onReceive(): void;

  onCancel(): void;

}

export default function GoodsReceivedDialog({

  open,

  onReceive,

  onCancel,

}: Props) {

  if (!open)
    return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-lg rounded-xl bg-white p-6">

        <h2 className="mb-4 text-xl font-bold">

          Receive Goods

        </h2>

        <p className="mb-6">

          Receiving these goods will automatically update Inventory, create Stock Movements, and refresh the ERP dashboard.

        </p>

        <div className="flex justify-end gap-3">

          <Button
            variant="ghost"
            onClick={onCancel}
          >

            Cancel

          </Button>

          <Button
            onClick={onReceive}
          >

            Receive Goods

          </Button>

        </div>

      </div>

    </div>

  );

}