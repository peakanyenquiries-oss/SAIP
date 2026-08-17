"use client";

import { useEffect } from "react";

import { PurchaseOrder } from "@/types/purchase-order";

interface PurchaseOrderPrintDocumentProps {
  order: PurchaseOrder;
  onClose: () => void;
}

export default function PurchaseOrderPrintDocument({
  order,
  onClose,
}: PurchaseOrderPrintDocumentProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.print();
    }, 300);

    const handleAfterPrint = () => {
      onClose();
    };

    window.addEventListener(
      "afterprint",
      handleAfterPrint
    );

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(
        "afterprint",
        handleAfterPrint
      );
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-white print:static print:block">
      <div className="mx-auto min-h-screen max-w-[900px] bg-white px-8 py-10 text-slate-900 print:max-w-none print:px-0 print:py-0">
        <div className="mb-8 flex items-start justify-between border-b-2 border-slate-900 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              SAIP
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              South African Automotive Intelligence Platform
            </p>

            <p className="mt-4 text-xs text-slate-500">
              PURCHASE ORDER
            </p>
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-bold">
              {order.poNumber}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Status:{" "}
              <span className="font-semibold text-slate-800">
                {order.status}
              </span>
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              Supplier
            </h3>

            <div className="rounded-lg border border-slate-200 p-4">
              <p className="font-semibold">
                {order.supplierName}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Supplier ID: {order.supplierId}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              Order Information
            </h3>

            <div className="rounded-lg border border-slate-200 p-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">
                  Order Date
                </span>

                <span className="font-medium">
                  {formatDate(order.orderDate)}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-4">
                <span className="text-slate-500">
                  Expected Delivery
                </span>

                <span className="font-medium">
                  {order.expectedDeliveryDate
                    ? formatDate(
                        order.expectedDeliveryDate
                      )
                    : "Not specified"}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-4">
                <span className="text-slate-500">
                  Created By
                </span>

                <span className="font-medium">
                  {order.createdBy}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 overflow-hidden rounded-lg border border-slate-300">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border-b border-slate-300 p-3 text-left text-xs font-bold uppercase">
                  #
                </th>

                <th className="border-b border-slate-300 p-3 text-left text-xs font-bold uppercase">
                  SKU
                </th>

                <th className="border-b border-slate-300 p-3 text-left text-xs font-bold uppercase">
                  Product
                </th>

                <th className="border-b border-slate-300 p-3 text-center text-xs font-bold uppercase">
                  Qty
                </th>

                <th className="border-b border-slate-300 p-3 text-right text-xs font-bold uppercase">
                  Unit Cost
                </th>

                <th className="border-b border-slate-300 p-3 text-right text-xs font-bold uppercase">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="border-b border-slate-200 p-3 text-sm">
                    {index + 1}
                  </td>

                  <td className="border-b border-slate-200 p-3 text-sm font-medium">
                    {item.sku}
                  </td>

                  <td className="border-b border-slate-200 p-3 text-sm">
                    {item.productName}
                  </td>

                  <td className="border-b border-slate-200 p-3 text-center text-sm">
                    {item.quantity}
                  </td>

                  <td className="border-b border-slate-200 p-3 text-right text-sm">
                    {formatCurrency(item.unitCost)}
                  </td>

                  <td className="border-b border-slate-200 p-3 text-right text-sm font-medium">
                    {formatCurrency(item.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-8 flex justify-end">
          <div className="w-full max-w-sm">
            <div className="flex justify-between py-2 text-sm">
              <span className="text-slate-500">
                Subtotal
              </span>

              <span className="font-medium">
                {formatCurrency(order.subtotal)}
              </span>
            </div>

            <div className="flex justify-between py-2 text-sm">
              <span className="text-slate-500">
                VAT (15%)
              </span>

              <span className="font-medium">
                {formatCurrency(order.vat)}
              </span>
            </div>

            <div className="mt-2 flex justify-between border-t-2 border-slate-900 pt-4">
              <span className="text-lg font-bold">
                TOTAL
              </span>

              <span className="text-lg font-bold">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="mb-8">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              Notes
            </h3>

            <div className="rounded-lg border border-slate-200 p-4 text-sm whitespace-pre-wrap">
              {order.notes}
            </div>
          </div>
        )}

        {order.approvedBy && (
          <div className="mb-10 rounded-lg border border-slate-300 p-5">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
              Approval
            </h3>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-slate-500">
                  Approved By
                </p>

                <p className="mt-1 font-semibold">
                  {order.approvedBy}
                </p>
              </div>

              <div>
                <p className="text-slate-500">
                  Approval Date
                </p>

                <p className="mt-1 font-semibold">
                  {order.approvedDate
                    ? formatDateTime(
                        order.approvedDate
                      )
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-slate-300 pt-6 text-center text-xs text-slate-500">
          <p>
            SAIP — South African Automotive Intelligence Platform
          </p>

          <p className="mt-1">
            Purchase Order: {order.poNumber}
          </p>

          <p className="mt-1">
            This document was generated electronically.
          </p>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(
  value: number
): string {
  return `R ${value.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(
  value: string
): string {
  return new Date(value).toLocaleDateString(
    "en-ZA"
  );
}

function formatDateTime(
  value: string
): string {
  return new Date(value).toLocaleString(
    "en-ZA"
  );
}