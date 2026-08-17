"use client";

import { useMemo, useState } from "react";

import {
  CheckCircle2,
  Package,
  Loader2,
  AlertCircle,
} from "lucide-react";

import Button from "@/components/ui/Button";

import {
  PurchaseOrder,
} from "@/types/purchase-order";

import {
  getInventory,
} from "@/lib/inventory-service";

import {
  processStockTransaction,
} from "@/lib/erp-engine";

import {
  updatePurchaseOrder,
  getPurchaseOrderById,
} from "../services/purchase-storage.service";

interface GoodsReceivedFormProps {
  purchaseOrders: PurchaseOrder[];

  onComplete(): void;
}

interface ReceivedItem {
  id: string;

  productId: string;

  productName: string;

  orderedQuantity: number;

  previouslyReceivedQuantity: number;

  receivedQuantity: number;
}

export default function GoodsReceivedForm({
  purchaseOrders,
  onComplete,
}: GoodsReceivedFormProps) {
  const [
    purchaseOrderId,
    setPurchaseOrderId,
  ] = useState("");

  const [
    items,
    setItems,
  ] = useState<ReceivedItem[]>([]);

  const [
    processing,
    setProcessing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const purchaseOrder =
    useMemo(() => {
      return purchaseOrders.find(
        (order) =>
          order.id ===
          purchaseOrderId
      );
    }, [
      purchaseOrders,
      purchaseOrderId,
    ]);

  function loadPurchaseOrder(
    id: string
  ) {
    setPurchaseOrderId(id);

    setError(null);

    const order =
      purchaseOrders.find(
        (purchase) =>
          purchase.id === id
      );

    if (!order) {
      setItems([]);
      return;
    }

    setItems(
      order.items.map(
        (item) => {
          const previouslyReceived =
            item.receivedQuantity ??
            0;

          const outstanding =
            Math.max(
              0,
              item.quantity -
                previouslyReceived
            );

          return {
            id: item.id,

            productId:
              item.productId,

            productName:
              item.productName,

            orderedQuantity:
              item.quantity,

            previouslyReceivedQuantity:
              previouslyReceived,

            receivedQuantity:
              outstanding,
          };
        }
      )
    );
  }

  function updateQuantity(
    id: string,
    quantity: number
  ) {
    const safeQuantity =
      Math.max(
        0,
        Number.isFinite(quantity)
          ? quantity
          : 0
      );

    setItems(
      (current) =>
        current.map(
          (item) =>
            item.id === id
              ? {
                  ...item,

                  receivedQuantity:
                    Math.min(
                      safeQuantity,
                      Math.max(
                        0,
                        item.orderedQuantity -
                          item.previouslyReceivedQuantity
                      )
                    ),
                }
              : item
        )
    );
  }

  async function completeReceiving() {
    if (!purchaseOrder) {
      setError(
        "Please select a purchase order."
      );

      return;
    }

    if (processing) {
      return;
    }

    const itemsToReceive =
      items.filter(
        (item) =>
          item.receivedQuantity > 0
      );

    if (
      itemsToReceive.length === 0
    ) {
      setError(
        "Enter a received quantity for at least one product."
      );

      return;
    }

    setProcessing(true);

    setError(null);

    try {
      const inventory =
        await getInventory();

      for (
        const item of itemsToReceive
      ) {
        const inventoryItem =
          inventory.find(
            (inventoryRecord) =>
              inventoryRecord.productId ===
              item.productId
          );

        if (!inventoryItem) {
          throw new Error(
            `No inventory record exists for ${item.productName}. Create the inventory record before receiving this product.`
          );
        }

        const success =
          await processStockTransaction({
            productId:
              item.productId,

            inventoryId:
              inventoryItem.id,

            quantity:
              item.receivedQuantity,

            movementType:
              "Goods Received",

            referenceNumber:
              purchaseOrder.poNumber,

            referenceType:
              "Purchase Order",

            notes:
              `Goods received against purchase order ${purchaseOrder.poNumber}.`,

            performedBy:
              "SAIP User",
          });

        if (!success) {
          throw new Error(
            `Failed to update stock for ${item.productName}.`
          );
        }
      }

      const latestOrder =
        getPurchaseOrderById(
          purchaseOrder.id
        );

      if (!latestOrder) {
        throw new Error(
          "Purchase order could not be found after receiving stock."
        );
      }

      const updatedItems =
        latestOrder.items.map(
          (orderItem) => {
            const receivingItem =
              items.find(
                (item) =>
                  item.id ===
                  orderItem.id
              );

            const previousReceived =
              orderItem.receivedQuantity ??
              0;

            const additionalReceived =
              receivingItem
                ?.receivedQuantity ??
              0;

            const totalReceived =
              Math.min(
                orderItem.quantity,
                previousReceived +
                  additionalReceived
              );

            return {
              ...orderItem,

              receivedQuantity:
                totalReceived,
            };
          }
        );

      const totalOrdered =
        updatedItems.reduce(
          (
            total,
            item
          ) =>
            total +
            item.quantity,
          0
        );

      const totalReceived =
        updatedItems.reduce(
          (
            total,
            item
          ) =>
            total +
            (item.receivedQuantity ??
              0),
          0
        );

      let status =
        latestOrder.status;

      if (
        totalOrdered > 0 &&
        totalReceived >=
          totalOrdered
      ) {
        status =
          "Completed";
      } else if (
        totalReceived > 0
      ) {
        status =
          "Partially Received";
      } else {
        status =
          "Ordered";
      }

      const updatedPurchaseOrder:
        PurchaseOrder = {
        ...latestOrder,

        items:
          updatedItems,

        status,

        updatedAt:
          new Date().toISOString(),
      };

      updatePurchaseOrder(
        updatedPurchaseOrder
      );

      onComplete();
    } catch (err) {
      console.error(
        "Goods receiving failed:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Goods receiving failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  }

  const totalReceived =
    items.reduce(
      (
        total,
        item
      ) =>
        total +
        item.receivedQuantity,
      0
    );

  const totalOutstanding =
    items.reduce(
      (
        total,
        item
      ) =>
        total +
        Math.max(
          0,
          item.orderedQuantity -
            item.previouslyReceivedQuantity -
            item.receivedQuantity
        ),
      0
    );

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <p className="text-sm">
            {error}
          </p>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Purchase Order
        </label>

        <select
          value={
            purchaseOrderId
          }
          onChange={(event) =>
            loadPurchaseOrder(
              event.target.value
            )
          }
          disabled={processing}
          className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">
            Select Purchase Order
          </option>

          {purchaseOrders.map(
            (order) => (
              <option
                key={order.id}
                value={order.id}
              >
                {order.poNumber}
                {" - "}
                {order.supplierName}
              </option>
            )
          )}
        </select>
      </div>

      {purchaseOrder && (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="border-b bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-800">
              Products to Receive
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Enter the quantity physically received in this delivery.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-slate-600">
                    Product
                  </th>

                  <th className="p-3 text-center text-sm font-semibold text-slate-600">
                    Ordered
                  </th>

                  <th className="p-3 text-center text-sm font-semibold text-slate-600">
                    Previously Received
                  </th>

                  <th className="p-3 text-center text-sm font-semibold text-slate-600">
                    Receive Now
                  </th>

                  <th className="p-3 text-center text-sm font-semibold text-slate-600">
                    Outstanding
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map(
                  (item) => {
                    const outstanding =
                      Math.max(
                        0,
                        item.orderedQuantity -
                          item.previouslyReceivedQuantity -
                          item.receivedQuantity
                      );

                    return (
                      <tr
                        key={item.id}
                        className="border-t border-slate-200"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Package
                              size={16}
                              className="text-slate-500"
                            />

                            <span className="font-medium text-slate-800">
                              {
                                item.productName
                              }
                            </span>
                          </div>
                        </td>

                        <td className="p-3 text-center text-slate-600">
                          {
                            item.orderedQuantity
                          }
                        </td>

                        <td className="p-3 text-center text-slate-600">
                          {
                            item.previouslyReceivedQuantity
                          }
                        </td>

                        <td className="p-3 text-center">
                          <input
                            type="number"
                            min={0}
                            max={Math.max(
                              0,
                              item.orderedQuantity -
                                item.previouslyReceivedQuantity
                            )}
                            value={
                              item.receivedQuantity
                            }
                            disabled={
                              processing
                            }
                            onChange={(
                              event
                            ) =>
                              updateQuantity(
                                item.id,
                                Number(
                                  event
                                    .target
                                    .value
                                )
                              )
                            }
                            className="w-24 rounded-lg border border-slate-300 p-2 text-center outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </td>

                        <td className="p-3 text-center font-medium text-slate-700">
                          {
                            outstanding
                          }
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {purchaseOrder && (
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-slate-500">
                Purchase Order
              </p>

              <p className="font-semibold text-slate-800">
                {
                  purchaseOrder.poNumber
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Supplier
              </p>

              <p className="font-semibold text-slate-800">
                {
                  purchaseOrder.supplierName
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Receiving Now
              </p>

              <p className="font-semibold text-slate-800">
                {totalReceived}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Still Outstanding
              </p>

              <p className="font-semibold text-slate-800">
                {
                  totalOutstanding
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {purchaseOrder && (
        <div className="flex justify-end">
          <Button
            onClick={
              completeReceiving
            }
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Processing...
              </>
            ) : (
              <>
                <CheckCircle2
                  size={18}
                />

                Receive Goods
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}