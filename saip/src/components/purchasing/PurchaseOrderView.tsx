"use client";

import {
  CheckCircle2,
  ClipboardList,
  Package,
  Printer,
  Truck,
} from "lucide-react";

import Button from "@/components/ui/Button";

import { PurchaseOrder } from "@/types/purchase-order";

interface PurchaseOrderViewProps {
  order: PurchaseOrder;
  onClose: () => void;
}

function formatCurrency(value: number) {
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getStatusClass(status: PurchaseOrder["status"]) {
  switch (status) {
    case "Draft":
      return "bg-slate-100 text-slate-700";

    case "Pending Approval":
      return "bg-amber-100 text-amber-700";

    case "Approved":
      return "bg-green-100 text-green-700";

    case "Ordered":
      return "bg-purple-100 text-purple-700";

    case "Partially Received":
      return "bg-orange-100 text-orange-700";

    case "Completed":
      return "bg-blue-100 text-blue-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getWorkflowSteps() {
  return [
    "Draft",
    "Pending Approval",
    "Approved",
    "Ordered",
    "Partially Received",
    "Completed",
  ];
}

function getWorkflowState(
  currentStatus: PurchaseOrder["status"],
  step: string
) {
  const steps = getWorkflowSteps();

  const currentIndex = steps.indexOf(currentStatus);
  const stepIndex = steps.indexOf(step);

  if (currentStatus === "Cancelled") {
    return "cancelled";
  }

  if (stepIndex < currentIndex) {
    return "complete";
  }

  if (stepIndex === currentIndex) {
    return "current";
  }

  return "pending";
}

export default function PurchaseOrderView({
  order,
  onClose,
}: PurchaseOrderViewProps) {
  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <ClipboardList
              size={26}
              className="text-blue-700"
            />

            <h2 className="text-2xl font-bold text-slate-900">
              {order.poNumber}
            </h2>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Purchase Order
          </p>
        </div>

        <div className="flex gap-2 print:hidden">
          <Button
            variant="ghost"
            onClick={handlePrint}
          >
            <Printer size={18} />
            Print
          </Button>

          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Supplier
          </p>

          <p className="mt-2 font-semibold text-slate-900">
            {order.supplierName || "—"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Order Date
          </p>

          <p className="mt-2 font-semibold text-slate-900">
            {formatDate(order.orderDate)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Expected Delivery
          </p>

          <p className="mt-2 font-semibold text-slate-900">
            {formatDate(order.expectedDeliveryDate)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Created By
          </p>

          <p className="mt-2 font-semibold text-slate-900">
            {order.createdBy || "—"}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <Truck
              size={20}
              className="text-blue-700"
            />

            <div>
              <h3 className="font-semibold text-slate-900">
                Purchase Order Workflow
              </h3>

              <p className="text-sm text-slate-500">
                Current purchase order lifecycle position
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto p-5">
          <div className="flex min-w-[760px] items-start">
            {getWorkflowSteps().map(
              (step, index) => {
                const state = getWorkflowState(
                  order.status,
                  step
                );

                return (
                  <div
                    key={step}
                    className="flex flex-1 items-start"
                  >
                    <div className="flex flex-1 flex-col items-center text-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          state === "complete"
                            ? "bg-green-100 text-green-700"
                            : state === "current"
                              ? "bg-blue-100 text-blue-700 ring-2 ring-blue-200"
                              : state === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {state === "complete" ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <span className="text-sm font-bold">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      <p
                        className={`mt-2 text-xs font-semibold ${
                          state === "current"
                            ? "text-blue-700"
                            : state === "complete"
                              ? "text-green-700"
                              : "text-slate-500"
                        }`}
                      >
                        {step}
                      </p>
                    </div>

                    {index <
                      getWorkflowSteps().length -
                        1 && (
                      <div
                        className={`mt-5 h-0.5 flex-1 ${
                          state === "complete"
                            ? "bg-green-300"
                            : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-200 p-5">
          <Package
            size={20}
            className="text-blue-700"
          />

          <div>
            <h3 className="font-semibold text-slate-900">
              Ordered Products
            </h3>

            <p className="text-sm text-slate-500">
              {order.items.length} product
              {order.items.length === 1 ? "" : "s"} on this order
            </p>
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

                <th className="p-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Quantity
                </th>

                <th className="p-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Unit Cost
                </th>

                <th className="p-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Line Total
                </th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-200"
                >
                  <td className="p-4 text-sm font-medium text-slate-700">
                    {item.sku}
                  </td>

                  <td className="p-4 text-sm text-slate-700">
                    {item.productName}
                  </td>

                  <td className="p-4 text-right text-sm text-slate-700">
                    {item.quantity}
                  </td>

                  <td className="p-4 text-right text-sm text-slate-700">
                    {formatCurrency(item.unitCost)}
                  </td>

                  <td className="p-4 text-right text-sm font-semibold text-slate-900">
                    {formatCurrency(item.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900">
            Order Information
          </h3>

          <div className="mt-5 space-y-4">
            <div className="flex justify-between gap-4">
              <span className="text-sm text-slate-500">
                PO Number
              </span>

              <span className="text-sm font-medium text-slate-900">
                {order.poNumber}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-sm text-slate-500">
                Created
              </span>

              <span className="text-sm font-medium text-slate-900">
                {formatDate(order.createdAt)}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-sm text-slate-500">
                Last Updated
              </span>

              <span className="text-sm font-medium text-slate-900">
                {formatDate(order.updatedAt)}
              </span>
            </div>

            {order.approvedBy && (
              <div className="flex justify-between gap-4">
                <span className="text-sm text-slate-500">
                  Approved By
                </span>

                <span className="text-sm font-medium text-slate-900">
                  {order.approvedBy}
                </span>
              </div>
            )}

            {order.approvedDate && (
              <div className="flex justify-between gap-4">
                <span className="text-sm text-slate-500">
                  Approval Date
                </span>

                <span className="text-sm font-medium text-slate-900">
                  {formatDate(order.approvedDate)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-6">
          <h3 className="font-semibold text-slate-900">
            Order Summary
          </h3>

          <div className="mt-5 space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-500">
                Subtotal
              </span>

              <span className="font-medium text-slate-900">
                {formatCurrency(order.subtotal)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                VAT
              </span>

              <span className="font-medium text-slate-900">
                {formatCurrency(order.vat)}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-slate-900">
                  Total
                </span>

                <span className="text-xl font-bold text-blue-700">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold text-slate-900">
            Notes
          </h3>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {order.notes}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 print:hidden">
        <Button
          variant="ghost"
          onClick={onClose}
        >
          Close
        </Button>

        <Button onClick={handlePrint}>
          <Printer size={18} />
          Print Purchase Order
        </Button>
      </div>
    </div>
  );
}