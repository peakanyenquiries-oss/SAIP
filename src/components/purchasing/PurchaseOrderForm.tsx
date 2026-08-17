"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Save,
} from "lucide-react";

import Button from "@/components/ui/Button";

import { Supplier } from "@/types/supplier";
import { Product } from "@/types/product";
import {
  PurchaseOrder,
  PurchaseOrderItem,
} from "@/types/purchase-order";

interface PurchaseOrderFormProps {
  suppliers: Supplier[];
  products: Product[];
  onSave: (order: PurchaseOrder) => void;
  onCancel: () => void;
  initialOrder?: PurchaseOrder | null;
}

interface DraftItem {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  quantity: number;
  receivedQuantity: number;
  unitCost: number;
}

export default function PurchaseOrderForm({
  suppliers,
  products,
  onSave,
  onCancel,
  initialOrder = null,
}: PurchaseOrderFormProps) {
  const [supplierId, setSupplierId] =
    useState("");

  const [orderDate, setOrderDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [
    expectedDeliveryDate,
    setExpectedDeliveryDate,
  ] = useState("");

  const [notes, setNotes] =
    useState("");

  const [items, setItems] =
    useState<DraftItem[]>([]);

  const [
    selectedProductId,
    setSelectedProductId,
  ] = useState("");

  const [
    selectedQuantity,
    setSelectedQuantity,
  ] = useState(1);

  const [
    selectedUnitCost,
    setSelectedUnitCost,
  ] = useState(0);

  const isEditMode =
    Boolean(initialOrder);

  useEffect(() => {
    if (!initialOrder) {
      setSupplierId("");

      setOrderDate(
        new Date()
          .toISOString()
          .split("T")[0]
      );

      setExpectedDeliveryDate("");
      setNotes("");
      setItems([]);
      setSelectedProductId("");
      setSelectedQuantity(1);
      setSelectedUnitCost(0);

      return;
    }

    setSupplierId(
      initialOrder.supplierId
    );

    setOrderDate(
      initialOrder.orderDate
    );

    setExpectedDeliveryDate(
      initialOrder.expectedDeliveryDate
    );

    setNotes(
      initialOrder.notes
    );

    setItems(
      initialOrder.items.map(
        (item) => ({
          id: item.id,
          productId:
            item.productId,
          sku: item.sku,
          productName:
            item.productName,
          quantity:
            item.quantity,
          receivedQuantity:
            item.receivedQuantity ?? 0,
          unitCost:
            item.unitCost,
        })
      )
    );

    setSelectedProductId("");
    setSelectedQuantity(1);
    setSelectedUnitCost(0);
  }, [initialOrder]);

  const selectedSupplier =
    useMemo(
      () =>
        suppliers.find(
          (supplier) =>
            supplier.id ===
            supplierId
        ),
      [suppliers, supplierId]
    );

  const subtotal =
    items.reduce(
      (total, item) =>
        total +
        item.quantity *
          item.unitCost,
      0
    );

  const vat =
    subtotal * 0.15;

  const total =
    subtotal + vat;

  function handleProductChange(
    productId: string
  ) {
    setSelectedProductId(
      productId
    );

    const product =
      products.find(
        (item) =>
          item.id ===
          productId
      );

    if (product) {
      setSelectedUnitCost(
        product.costPrice
      );
    } else {
      setSelectedUnitCost(0);
    }
  }

  function addItem() {
    if (!selectedProductId) {
      return;
    }

    const product =
      products.find(
        (item) =>
          item.id ===
          selectedProductId
      );

    if (!product) {
      return;
    }

    const quantity =
      Math.max(
        1,
        selectedQuantity
      );

    const unitCost =
      Math.max(
        0,
        selectedUnitCost
      );

    const existingItem =
      items.find(
        (item) =>
          item.productId ===
          product.id
      );

    if (existingItem) {
      setItems(
        (current) =>
          current.map(
            (item) =>
              item.productId ===
              product.id
                ? {
                    ...item,
                    quantity:
                      item.quantity +
                      quantity,
                    unitCost,
                  }
                : item
          )
      );
    } else {
      setItems(
        (current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            productId:
              product.id,
            sku: product.sku,
            productName:
              product.name,
            quantity,
            receivedQuantity: 0,
            unitCost,
          },
        ]
      );
    }

    setSelectedProductId("");
    setSelectedQuantity(1);
    setSelectedUnitCost(0);
  }

  function removeItem(
    productId: string
  ) {
    setItems(
      (current) =>
        current.filter(
          (item) =>
            item.productId !==
            productId
        )
    );
  }

  function updateQuantity(
    productId: string,
    quantity: number
  ) {
    const safeQuantity =
      Math.max(
        1,
        Number.isFinite(
          quantity
        )
          ? quantity
          : 1
      );

    setItems(
      (current) =>
        current.map(
          (item) =>
            item.productId ===
            productId
              ? {
                  ...item,
                  quantity:
                    Math.max(
                      safeQuantity,
                      item.receivedQuantity
                    ),
                }
              : item
        )
    );
  }

  function updateUnitCost(
    productId: string,
    unitCost: number
  ) {
    const safeUnitCost =
      Math.max(
        0,
        Number.isFinite(
          unitCost
        )
          ? unitCost
          : 0
      );

    setItems(
      (current) =>
        current.map(
          (item) =>
            item.productId ===
            productId
              ? {
                  ...item,
                  unitCost:
                    safeUnitCost,
                }
              : item
        )
    );
  }

  function savePurchaseOrder() {
    if (!supplierId) {
      alert(
        "Please select a supplier."
      );
      return;
    }

    if (items.length === 0) {
      alert(
        "Please add at least one product."
      );
      return;
    }

    if (!orderDate) {
      alert(
        "Please select an order date."
      );
      return;
    }

    const now =
      new Date().toISOString();

    const purchaseOrderItems:
      PurchaseOrderItem[] =
      items.map(
        (item) => ({
          id: item.id,
          productId:
            item.productId,
          sku: item.sku,
          productName:
            item.productName,
          quantity:
            item.quantity,
          receivedQuantity:
            item.receivedQuantity,
          unitCost:
            item.unitCost,
          lineTotal:
            item.quantity *
            item.unitCost,
        })
      );

    const purchaseOrder:
      PurchaseOrder =
      initialOrder
        ? {
            ...initialOrder,
            supplierId,
            supplierName:
              selectedSupplier?.company ??
              initialOrder.supplierName,
            orderDate,
            expectedDeliveryDate,
            items:
              purchaseOrderItems,
            subtotal,
            vat,
            total,
            notes,
            updatedAt: now,
          }
        : {
            id: crypto.randomUUID(),

            poNumber:
              `PO-${Date.now()}`,

            supplierId,

            supplierName:
              selectedSupplier?.company ??
              "",

            orderDate,

            expectedDeliveryDate,

            status: "Draft",

            items:
              purchaseOrderItems,

            subtotal,

            vat,

            total,

            notes,

            createdBy:
              "SAIP User",

            createdAt: now,

            updatedAt: now,
          };

    onSave(
      purchaseOrder
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Purchase Order Details
            </h2>

            {initialOrder && (
              <p className="mt-1 text-sm text-slate-500">
                Editing{" "}
                {initialOrder.poNumber}
              </p>
            )}
          </div>

          {initialOrder && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              Edit Mode
            </span>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Supplier
            </label>

            <select
              value={supplierId}
              onChange={(event) =>
                setSupplierId(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white p-3"
            >
              <option value="">
                Select Supplier
              </option>

              {suppliers.map(
                (supplier) => (
                  <option
                    key={
                      supplier.id
                    }
                    value={
                      supplier.id
                    }
                  >
                    {
                      supplier.company
                    }
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Order Date
            </label>

            <input
              type="date"
              value={orderDate}
              onChange={(event) =>
                setOrderDate(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Expected Delivery
            </label>

            <input
              type="date"
              value={
                expectedDeliveryDate
              }
              onChange={(event) =>
                setExpectedDeliveryDate(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-5 text-lg font-semibold text-slate-800">
          Add Products
        </h2>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Product
            </label>

            <select
              value={
                selectedProductId
              }
              onChange={(event) =>
                handleProductChange(
                  event.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white p-3"
            >
              <option value="">
                Select Product
              </option>

              {products
                .filter(
                  (product) =>
                    product.status ===
                    "Active"
                )
                .map(
                  (product) => (
                    <option
                      key={
                        product.id
                      }
                      value={
                        product.id
                      }
                    >
                      {product.sku}
                      {" - "}
                      {
                        product.name
                      }
                    </option>
                  )
                )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Quantity
            </label>

            <input
              type="number"
              min={1}
              value={
                selectedQuantity
              }
              onChange={(event) =>
                setSelectedQuantity(
                  Math.max(
                    1,
                    Number(
                      event.target
                        .value
                    )
                  )
                )
              }
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Unit Cost
            </label>

            <input
              type="number"
              min={0}
              step="0.01"
              value={
                selectedUnitCost
              }
              onChange={(event) =>
                setSelectedUnitCost(
                  Math.max(
                    0,
                    Number(
                      event.target
                        .value
                    )
                  )
                )
              }
              className="w-full rounded-lg border border-slate-300 p-3"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            onClick={addItem}
          >
            <Plus size={18} />
            Add Product
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Order Items
          </h2>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No products added to this purchase order.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold">
                    SKU
                  </th>

                  <th className="p-4 text-left text-sm font-semibold">
                    Product
                  </th>

                  <th className="p-4 text-center text-sm font-semibold">
                    Quantity
                  </th>

                  <th className="p-4 text-right text-sm font-semibold">
                    Unit Cost
                  </th>

                  <th className="p-4 text-right text-sm font-semibold">
                    Line Total
                  </th>

                  <th className="p-4 text-center text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map(
                  (item) => (
                    <tr
                      key={
                        item.id
                      }
                      className="border-t border-slate-200"
                    >
                      <td className="p-4">
                        {item.sku}
                      </td>

                      <td className="p-4">
                        {
                          item.productName
                        }
                      </td>

                      <td className="p-4 text-center">
                        <input
                          type="number"
                          min={
                            Math.max(
                              1,
                              item.receivedQuantity
                            )
                          }
                          value={
                            item.quantity
                          }
                          onChange={(
                            event
                          ) =>
                            updateQuantity(
                              item.productId,
                              Number(
                                event
                                  .target
                                  .value
                              )
                            )
                          }
                          className="w-24 rounded-lg border border-slate-300 p-2 text-center"
                        />
                      </td>

                      <td className="p-4 text-right">
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={
                            item.unitCost
                          }
                          onChange={(
                            event
                          ) =>
                            updateUnitCost(
                              item.productId,
                              Number(
                                event
                                  .target
                                  .value
                              )
                            )
                          }
                          className="w-32 rounded-lg border border-slate-300 p-2 text-right"
                        />
                      </td>

                      <td className="p-4 text-right font-medium">
                        R{" "}
                        {(
                          item.quantity *
                          item.unitCost
                        ).toLocaleString(
                          "en-ZA",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </td>

                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              item.productId
                            )
                          }
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          aria-label={`Remove ${item.productName}`}
                        >
                          <Trash2
                            size={18}
                          />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Notes
          </label>

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(
                event.target.value
              )
            }
            rows={6}
            placeholder="Purchase order notes..."
            className="w-full rounded-lg border border-slate-300 p-3"
          />
        </div>

        <div className="rounded-xl bg-slate-50 p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-500">
                Subtotal
              </span>

              <span className="font-medium">
                R{" "}
                {subtotal.toLocaleString(
                  "en-ZA",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                VAT (15%)
              </span>

              <span className="font-medium">
                R{" "}
                {vat.toLocaleString(
                  "en-ZA",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-slate-800">
                  Total
                </span>

                <span className="text-xl font-bold text-blue-700">
                  R{" "}
                  {total.toLocaleString(
                    "en-ZA",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </span>
              </div>
            </div>
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
          onClick={
            savePurchaseOrder
          }
        >
          <Save size={18} />
          {isEditMode
            ? "Update Purchase Order"
            : "Save Purchase Order"}
        </Button>
      </div>
    </div>
  );
}