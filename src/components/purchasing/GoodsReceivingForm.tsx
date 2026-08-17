"use client";

import { useMemo, useState } from "react";
import { PackageCheck } from "lucide-react";

import Button from "@/components/ui/Button";

import { PurchaseOrder } from "@/types/purchase-order";

interface GoodsReceivingFormProps {
  order: PurchaseOrder;
  onReceive: (
    order: PurchaseOrder,
    receivedQuantities: Record<string, number>
  ) => void;
  onCancel: () => void;
}

interface ReceivingRow {
  itemId: string;
  sku: string;
  productName: string;
  orderedQuantity: number;
  previouslyReceived: number;
  outstandingQuantity: number;
  receivingQuantity: number;
}

export default function GoodsReceivingForm({
  order,
  onReceive,
  onCancel,
}: GoodsReceivingFormProps) {
  const [receivedQuantities, setReceivedQuantities] =
    useState<Record<string, number>>(() => {
      const initial: Record<string, number> = {};

      order.items.forEach((item) => {
        initial[item.id] = 0;
      });

      return initial;
    });

  const rows = useMemo<ReceivingRow[]>(() => {
    return order.items.map((item) => {
      const previouslyReceived =
        getPreviouslyReceivedQuantity(item);

      const outstandingQuantity = Math.max(
        0,
        item.quantity - previouslyReceived
      );

      return {
        itemId: item.id,
        sku: item.sku,
        productName: item.productName,
        orderedQuantity: item.quantity,
        previouslyReceived,
        outstandingQuantity,
        receivingQuantity: Math.min(
          Math.max(
            0,
            receivedQuantities[item.id] ?? 0
          ),
          outstandingQuantity
        ),
      };
    });
  }, [order.items, receivedQuantities]);

  const totalOrdered = rows.reduce(
    (total, row) =>
      total + row.orderedQuantity,
    0
  );

  const totalPreviouslyReceived = rows.reduce(
    (total, row) =>
      total + row.previouslyReceived,
    0
  );

  const totalReceivingNow = rows.reduce(
    (total, row) =>
      total + row.receivingQuantity,
    0
  );

  const totalAfterReceiving =
    totalPreviouslyReceived +
    totalReceivingNow;

  const totalOutstanding = Math.max(
    0,
    totalOrdered - totalAfterReceiving
  );

  const willComplete =
    totalOutstanding === 0 &&
    totalOrdered > 0;

  function updateReceivedQuantity(
    itemId: string,
    value: number
  ) {
    const row = rows.find(
      (item) => item.itemId === itemId
    );

    if (!row) {
      return;
    }

    const safeValue = Math.min(
      Math.max(
        0,
        Number.isFinite(value)
          ? value
          : 0
      ),
      row.outstandingQuantity
    );

    setReceivedQuantities(
      (current) => ({
        ...current,
        [itemId]: safeValue,
      })
    );
  }

  function receiveAllOutstanding() {
    const next: Record<string, number> = {};

    rows.forEach((row) => {
      next[row.itemId] =
        row.outstandingQuantity;
    });

    setReceivedQuantities(next);
  }

  function clearReceiving() {
    const next: Record<string, number> = {};

    rows.forEach((row) => {
      next[row.itemId] = 0;
    });

    setReceivedQuantities(next);
  }

  function handleReceive() {
    if (totalReceivingNow <= 0) {
      alert(
        "Please enter at least one received quantity."
      );
      return;
    }

    onReceive(
      order,
      receivedQuantities
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <PackageCheck size={22} />
          </div>

          <div>
            <h3 className="font-semibold text-blue-900">
              Receive Goods
            </h3>

            <p className="mt-1 text-sm text-blue-700">
              Record the quantities physically
              received against{" "}
              <span className="font-semibold">
                {order.poNumber}
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard
          label="Ordered"
          value={String(totalOrdered)}
        />

        <SummaryCard
          label="Previously Received"
          value={String(
            totalPreviouslyReceived
          )}
        />

        <SummaryCard
          label="Receiving Now"
          value={String(
            totalReceivingNow
          )}
        />

        <SummaryCard
          label="Outstanding"
          value={String(
            totalOutstanding
          )}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-5">
          <div>
            <h3 className="font-semibold text-slate-800">
              Goods Received
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Enter the quantity received for each
              product.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={clearReceiving}
            >
              Clear
            </Button>

            <Button
              variant="ghost"
              onClick={
                receiveAllOutstanding
              }
            >
              Receive All
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  SKU
                </th>

                <th className="p-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Product
                </th>

                <th className="p-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Ordered
                </th>

                <th className="p-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Previously Received
                </th>

                <th className="p-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Outstanding
                </th>

                <th className="p-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Receive Now
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.itemId}
                  className="border-t border-slate-200"
                >
                  <td className="p-4 text-sm font-medium">
                    {row.sku}
                  </td>

                  <td className="p-4 text-sm">
                    {row.productName}
                  </td>

                  <td className="p-4 text-center text-sm">
                    {row.orderedQuantity}
                  </td>

                  <td className="p-4 text-center text-sm">
                    {row.previouslyReceived}
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        row.outstandingQuantity ===
                        0
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {
                        row.outstandingQuantity
                      }
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <input
                      type="number"
                      min={0}
                      max={
                        row.outstandingQuantity
                      }
                      value={
                        row.receivingQuantity
                      }
                      disabled={
                        row.outstandingQuantity ===
                        0
                      }
                      onChange={(event) =>
                        updateReceivedQuantity(
                          row.itemId,
                          Number(
                            event.target
                              .value
                          )
                        )
                      }
                      className="w-28 rounded-lg border border-slate-300 p-2 text-center outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className={`rounded-xl border p-5 ${
          willComplete
            ? "border-green-200 bg-green-50"
            : "border-amber-200 bg-amber-50"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p
              className={`text-sm font-semibold ${
                willComplete
                  ? "text-green-800"
                  : "text-amber-800"
              }`}
            >
              {willComplete
                ? "This receipt will complete the purchase order."
                : "This receipt will leave outstanding quantities."}
            </p>

            <p
              className={`mt-1 text-sm ${
                willComplete
                  ? "text-green-700"
                  : "text-amber-700"
              }`}
            >
              {totalReceivingNow} unit
              {totalReceivingNow === 1
                ? ""
                : "s"} being received.
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Remaining
            </p>

            <p className="text-2xl font-bold text-slate-800">
              {totalOutstanding}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          onClick={handleReceive}
          disabled={totalReceivingNow <= 0}
        >
          <PackageCheck size={18} />
          Record Goods Received
        </Button>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
}

function SummaryCard({
  label,
  value,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function getPreviouslyReceivedQuantity(
  item: PurchaseOrder["items"][number]
): number {
  const candidate =
    item as PurchaseOrder["items"][number] & {
      receivedQuantity?: number;
    };

  return Math.max(
    0,
    candidate.receivedQuantity ?? 0
  );
}