"use client";

import { useMemo, useState } from "react";

import Button from "@/components/ui/Button";

import { PurchaseOrder } from "@/types/purchase-order";

interface PurchaseOrderReceivingProps {
  order: PurchaseOrder;
  onReceive: (
    receivedQuantities: Record<string, number>
  ) => void;
  onCancel: () => void;
}

export default function PurchaseOrderReceiving({
  order,
  onReceive,
  onCancel,
}: PurchaseOrderReceivingProps) {
  const [receivedQuantities, setReceivedQuantities] =
    useState<Record<string, number>>({});

  const [error, setError] = useState("");

  const items = useMemo(() => {
    return order.items.map((item) => {
      const alreadyReceived =
        item.receivedQuantity ?? 0;

      const remaining = Math.max(
        0,
        item.quantity - alreadyReceived
      );

      return {
        ...item,
        alreadyReceived,
        remaining,
      };
    });
  }, [order.items]);

  const totalOrdered = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [items]);

  const totalPreviouslyReceived = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.alreadyReceived,
      0
    );
  }, [items]);

  const totalRemaining = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.remaining,
      0
    );
  }, [items]);

  const totalReceivingNow = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        Number(
          receivedQuantities[item.id] ?? 0
        ),
      0
    );
  }, [items, receivedQuantities]);

  function updateQuantity(
    itemId: string,
    value: string,
    maximum: number
  ) {
    setError("");

    if (value === "") {
      setReceivedQuantities((current) => ({
        ...current,
        [itemId]: 0,
      }));

      return;
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return;
    }

    const safeValue = Math.max(
      0,
      Math.min(
        Math.floor(numericValue),
        maximum
      )
    );

    setReceivedQuantities((current) => ({
      ...current,
      [itemId]: safeValue,
    }));
  }

  function receiveAllRemaining() {
    setError("");

    const quantities: Record<string, number> = {};

    items.forEach((item) => {
      quantities[item.id] = item.remaining;
    });

    setReceivedQuantities(quantities);
  }

  function clearReceiving() {
    setError("");
    setReceivedQuantities({});
  }

  function handleSubmit() {
    setError("");

    if (totalReceivingNow <= 0) {
      setError(
        "Enter at least one quantity to receive."
      );

      return;
    }

    const invalidItem = items.find(
      (item) => {
        const quantity =
          Number(
            receivedQuantities[item.id] ?? 0
          );

        return (
          quantity < 0 ||
          quantity > item.remaining
        );
      }
    );

    if (invalidItem) {
      setError(
        `The quantity for ${invalidItem.productName} cannot exceed the remaining quantity of ${invalidItem.remaining}.`
      );

      return;
    }

    const quantities: Record<string, number> = {};

    items.forEach((item) => {
      const quantity =
        Number(
          receivedQuantities[item.id] ?? 0
        );

      if (quantity > 0) {
        quantities[item.id] = quantity;
      }
    });

    onReceive(quantities);
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard
          label="Items"
          value={String(items.length)}
        />

        <SummaryCard
          label="Total Ordered"
          value={String(totalOrdered)}
        />

        <SummaryCard
          label="Previously Received"
          value={String(
            totalPreviouslyReceived
          )}
        />

        <SummaryCard
          label="Remaining"
          value={String(totalRemaining)}
        />
      </div>

      {/* Instructions */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <h3 className="font-semibold text-blue-900">
          Receive Goods
        </h3>

        <p className="mt-1 text-sm text-blue-700">
          Enter the quantity received for each
          item. You cannot receive more than the
          outstanding quantity.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      )}

      {/* Items */}
      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-slate-700">
                  SKU
                </th>

                <th className="p-4 text-left text-sm font-semibold text-slate-700">
                  Product
                </th>

                <th className="p-4 text-center text-sm font-semibold text-slate-700">
                  Ordered
                </th>

                <th className="p-4 text-center text-sm font-semibold text-slate-700">
                  Received
                </th>

                <th className="p-4 text-center text-sm font-semibold text-slate-700">
                  Remaining
                </th>

                <th className="p-4 text-center text-sm font-semibold text-slate-700">
                  Receive Now
                </th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => {
                const currentValue =
                  receivedQuantities[
                    item.id
                  ] ?? 0;

                const fullyReceived =
                  item.remaining === 0;

                return (
                  <tr
                    key={item.id}
                    className="border-t border-slate-200"
                  >
                    <td className="p-4 text-sm text-slate-600">
                      {item.sku}
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-slate-800">
                        {item.productName}
                      </div>
                    </td>

                    <td className="p-4 text-center font-medium">
                      {item.quantity}
                    </td>

                    <td className="p-4 text-center">
                      <span className="font-semibold text-green-600">
                        {item.alreadyReceived}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={
                          fullyReceived
                            ? "font-semibold text-green-600"
                            : "font-semibold text-amber-600"
                        }
                      >
                        {item.remaining}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center">
                        <input
                          type="number"
                          min={0}
                          max={item.remaining}
                          step={1}
                          value={
                            fullyReceived
                              ? 0
                              : currentValue
                          }
                          disabled={
                            fullyReceived
                          }
                          onChange={(event) =>
                            updateQuantity(
                              item.id,
                              event.target.value,
                              item.remaining
                            )
                          }
                          className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-center outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                          aria-label={`Receive quantity for ${item.productName}`}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receiving summary */}
      <div className="rounded-xl bg-slate-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">
              Receiving Now
            </p>

            <p className="text-2xl font-bold text-slate-800">
              {totalReceivingNow}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-500">
              Remaining After Receipt
            </p>

            <p className="text-2xl font-bold text-blue-700">
              {Math.max(
                0,
                totalRemaining -
                  totalReceivingNow
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            variant="ghost"
            onClick={clearReceiving}
          >
            Clear
          </Button>

          <Button
            variant="ghost"
            onClick={receiveAllRemaining}
            disabled={totalRemaining === 0}
          >
            Receive All Remaining
          </Button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={
            totalRemaining === 0 ||
            totalReceivingNow <= 0
          }
        >
          Confirm Receipt
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