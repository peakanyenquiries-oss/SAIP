"use client";

import { useMemo, useState } from "react";

import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Send,
  CheckCircle2,
  ShoppingCart,
  PackageCheck,
  XCircle,
} from "lucide-react";

import Button from "@/components/ui/Button";
import DataTable, {
  Column,
} from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import SectionCard from "@/components/ui/SectionCard";

import PurchaseOrderStats from "@/components/purchasing/PurchaseOrderStats";
import PurchaseOrderForm from "@/components/purchasing/PurchaseOrderForm";
import PurchaseOrderReceiving from "@/components/purchasing/PurchaseOrderReceiving";

import usePurchaseOrders from "@/hooks/usePurchaseOrders";
import useSuppliers from "@/hooks/useSuppliers";
import useProducts from "@/hooks/useProducts";

import { PurchaseOrder } from "@/types/purchase-order";

export default function PurchasingPage() {
  const {
    purchaseOrders,
    statistics,
    create,
    update,
    remove,
    refresh,
    submitForApproval,
    approve,
    markOrdered,
    cancel,
    receiveGoods,
  } = usePurchaseOrders();

  const { suppliers } = useSuppliers();
  const { products } = useProducts();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [receivingOpen, setReceivingOpen] =
    useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedOrder, setSelectedOrder] =
    useState<PurchaseOrder | null>(null);

  const filteredOrders = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return purchaseOrders;
    }

    return purchaseOrders.filter(
      (order) =>
        order.poNumber
          .toLowerCase()
          .includes(keyword) ||
        order.supplierName
          .toLowerCase()
          .includes(keyword) ||
        order.status
          .toLowerCase()
          .includes(keyword)
    );
  }, [purchaseOrders, search]);

  function openNewPurchaseOrder() {
    setSelectedOrder(null);
    setFormOpen(true);
  }

  function openEditPurchaseOrder(
    order: PurchaseOrder
  ) {
    setSelectedOrder(order);
    setFormOpen(true);
  }

  function openViewPurchaseOrder(
    order: PurchaseOrder
  ) {
    setSelectedOrder(order);
    setViewOpen(true);
  }

  function openReceiving(order: PurchaseOrder) {
    setSelectedOrder(order);
    setReceivingOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setSelectedOrder(null);
  }

  function closeView() {
    setViewOpen(false);
    setSelectedOrder(null);
  }

  function closeReceiving() {
    setReceivingOpen(false);
    setSelectedOrder(null);
  }

  function savePurchaseOrder(
    order: PurchaseOrder
  ) {
    if (
      selectedOrder &&
      selectedOrder.id === order.id
    ) {
      update(order);
    } else {
      create(order);
    }

    closeForm();
    refresh();
  }

  function askDelete(order: PurchaseOrder) {
    setSelectedOrder(order);
    setDeleteOpen(true);
  }

  function closeDelete() {
    setDeleteOpen(false);
    setSelectedOrder(null);
  }

  function deleteOrder() {
    if (!selectedOrder) {
      return;
    }

    remove(selectedOrder.id);
    closeDelete();
    refresh();
  }

  function handleSubmitForApproval(
    order: PurchaseOrder
  ) {
    submitForApproval(order.id);
    refresh();
  }

  function handleApprove(order: PurchaseOrder) {
    approve(order.id, "SAIP User");
    refresh();
  }

  function handleMarkOrdered(
    order: PurchaseOrder
  ) {
    markOrdered(order.id);
    refresh();
  }

  async function handleReceiveGoods(
    receivedQuantities: Record<string, number>
  ) {
    if (!selectedOrder) {
      return;
    }

    const result = await receiveGoods(
      selectedOrder.id,
      receivedQuantities
    );

    if (!result.success) {
      alert(result.message);
      return;
    }

    closeReceiving();
    refresh();
  }

  function handleCancel(order: PurchaseOrder) {
    cancel(order.id);
    refresh();
  }

  function getStatusActions(
    order: PurchaseOrder
  ) {
    switch (order.status) {
      case "Draft":
        return (
          <button
            type="button"
            onClick={() =>
              handleSubmitForApproval(order)
            }
            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
            title="Submit for Approval"
            aria-label={`Submit ${order.poNumber} for approval`}
          >
            <Send size={18} />
          </button>
        );

      case "Pending Approval":
        return (
          <button
            type="button"
            onClick={() =>
              handleApprove(order)
            }
            className="rounded-lg p-2 text-green-600 hover:bg-green-50"
            title="Approve Purchase Order"
            aria-label={`Approve ${order.poNumber}`}
          >
            <CheckCircle2 size={18} />
          </button>
        );

      case "Approved":
        return (
          <button
            type="button"
            onClick={() =>
              handleMarkOrdered(order)
            }
            className="rounded-lg p-2 text-purple-600 hover:bg-purple-50"
            title="Mark as Ordered"
            aria-label={`Mark ${order.poNumber} as ordered`}
          >
            <ShoppingCart size={18} />
          </button>
        );

      case "Ordered":
      case "Partially Received":
        return (
          <button
            type="button"
            onClick={() =>
              openReceiving(order)
            }
            className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
            title="Receive Goods"
            aria-label={`Receive goods for ${order.poNumber}`}
          >
            <PackageCheck size={18} />
          </button>
        );

      default:
        return null;
    }
  }

  const columns: Column<PurchaseOrder>[] = [
    {
      title: "PO Number",
      render: (order) => order.poNumber,
    },
    {
      title: "Supplier",
      render: (order) => order.supplierName,
    },
    {
      title: "Order Date",
      render: (order) =>
        new Date(
          order.orderDate
        ).toLocaleDateString("en-ZA"),
    },
    {
      title: "Status",
      render: (order) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            order.status === "Draft"
              ? "bg-slate-100 text-slate-700"
              : order.status ===
                  "Pending Approval"
                ? "bg-amber-100 text-amber-700"
                : order.status === "Approved"
                  ? "bg-green-100 text-green-700"
                  : order.status === "Ordered"
                    ? "bg-purple-100 text-purple-700"
                    : order.status ===
                        "Partially Received"
                      ? "bg-orange-100 text-orange-700"
                      : order.status === "Completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
          }`}
        >
          {order.status}
        </span>
      ),
    },
    {
      title: "Total",
      render: (order) =>
        `R ${order.total.toLocaleString(
          "en-ZA",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}`,
    },
    {
      title: "Actions",
      render: (order) => (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() =>
              openViewPurchaseOrder(order)
            }
            className="rounded-lg p-2 hover:bg-slate-100"
            aria-label={`View ${order.poNumber}`}
            title="View Purchase Order"
          >
            <Eye size={18} />
          </button>

          <button
            type="button"
            onClick={() =>
              openEditPurchaseOrder(order)
            }
            className="rounded-lg p-2 hover:bg-slate-100"
            aria-label={`Edit ${order.poNumber}`}
            title="Edit Purchase Order"
          >
            <Pencil size={18} />
          </button>

          {getStatusActions(order)}

          {order.status !== "Completed" &&
            order.status !== "Cancelled" && (
              <button
                type="button"
                onClick={() =>
                  handleCancel(order)
                }
                className="rounded-lg p-2 text-orange-600 hover:bg-orange-50"
                title="Cancel Purchase Order"
                aria-label={`Cancel ${order.poNumber}`}
              >
                <XCircle size={18} />
              </button>
            )}

          <button
            type="button"
            onClick={() => askDelete(order)}
            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
            aria-label={`Delete ${order.poNumber}`}
            title="Delete Purchase Order"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Purchasing"
        subtitle="Purchase Order Workspace"
        actions={
          <Button
            onClick={openNewPurchaseOrder}
          >
            <Plus size={18} />
            New Purchase Order
          </Button>
        }
      />

      <PurchaseOrderStats
        statistics={statistics}
      />

      <SectionCard
        title="Purchase Orders"
        subtitle="Manage supplier purchase orders."
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search purchase orders..."
            />
          </div>

          <Button
            variant="ghost"
            onClick={refresh}
          >
            Refresh
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={filteredOrders}
          emptyMessage="No purchase orders found."
        />
      </SectionCard>

      <SectionCard
        title="Workflow"
        subtitle="Purchase Order Lifecycle"
      >
        <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-6">
          <WorkflowStep
            title="Draft"
            description="Create PO"
          />

          <WorkflowStep
            title="Pending Approval"
            description="Awaiting approval"
          />

          <WorkflowStep
            title="Approved"
            description="Ready to order"
          />

          <WorkflowStep
            title="Ordered"
            description="Supplier order placed"
          />

          <WorkflowStep
            title="Partially Received"
            description="Goods being received"
          />

          <WorkflowStep
            title="Completed"
            description="Fully received"
          />
        </div>
      </SectionCard>

      <Modal
        open={formOpen}
        title={
          selectedOrder
            ? `Edit ${selectedOrder.poNumber}`
            : "New Purchase Order"
        }
        onClose={closeForm}
        width="xl"
      >
        <PurchaseOrderForm
          suppliers={suppliers}
          products={products}
          initialOrder={selectedOrder}
          onSave={savePurchaseOrder}
          onCancel={closeForm}
        />
      </Modal>

      <Modal
        open={receivingOpen}
        title={
          selectedOrder
            ? `Receive Goods — ${selectedOrder.poNumber}`
            : "Receive Goods"
        }
        onClose={closeReceiving}
        width="xl"
      >
        {selectedOrder && (
          <PurchaseOrderReceiving
            order={selectedOrder}
            onReceive={handleReceiveGoods}
            onCancel={closeReceiving}
          />
        )}
      </Modal>

      <Modal
        open={viewOpen}
        title={
          selectedOrder
            ? `Purchase Order ${selectedOrder.poNumber}`
            : "Purchase Order"
        }
        onClose={closeView}
        width="xl"
      >
        {selectedOrder && (
          <PurchaseOrderView
            order={selectedOrder}
          />
        )}
      </Modal>

      <Modal
        open={deleteOpen}
        title="Delete Purchase Order"
        onClose={closeDelete}
      >
        <div className="space-y-6">
          <p className="text-slate-600">
            Are you sure you want to permanently
            delete{" "}
            <span className="font-semibold">
              {selectedOrder?.poNumber}
            </span>
            ?
          </p>

          <div className="rounded-xl bg-slate-50 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">
                  Supplier
                </p>
                <p className="font-medium">
                  {selectedOrder?.supplierName}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Status
                </p>
                <p className="font-medium">
                  {selectedOrder?.status}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Order Value
                </p>
                <p className="font-medium">
                  R{" "}
                  {selectedOrder?.total.toLocaleString(
                    "en-ZA",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Items
                </p>
                <p className="font-medium">
                  {selectedOrder?.items.length}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={closeDelete}
            >
              Cancel
            </Button>

            <Button onClick={deleteOrder}>
              Delete Purchase Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

interface PurchaseOrderViewProps {
  order: PurchaseOrder;
}

function PurchaseOrderView({
  order,
}: PurchaseOrderViewProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <InfoBox
          label="PO Number"
          value={order.poNumber}
        />

        <InfoBox
          label="Supplier"
          value={order.supplierName}
        />

        <InfoBox
          label="Order Date"
          value={new Date(
            order.orderDate
          ).toLocaleDateString("en-ZA")}
        />

        <InfoBox
          label="Status"
          value={order.status}
        />
      </div>

      <div className="rounded-xl border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 p-5">
          <h3 className="font-semibold text-slate-800">
            Order Items
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left text-sm">
                  SKU
                </th>
                <th className="p-4 text-left text-sm">
                  Product
                </th>
                <th className="p-4 text-center text-sm">
                  Ordered
                </th>
                <th className="p-4 text-center text-sm">
                  Received
                </th>
                <th className="p-4 text-center text-sm">
                  Remaining
                </th>
                <th className="p-4 text-right text-sm">
                  Unit Cost
                </th>
                <th className="p-4 text-right text-sm">
                  Line Total
                </th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item) => {
                const received =
                  item.receivedQuantity ?? 0;

                const remaining = Math.max(
                  0,
                  item.quantity - received
                );

                return (
                  <tr
                    key={item.id}
                    className="border-t border-slate-200"
                  >
                    <td className="p-4">
                      {item.sku}
                    </td>

                    <td className="p-4">
                      {item.productName}
                    </td>

                    <td className="p-4 text-center">
                      {item.quantity}
                    </td>

                    <td className="p-4 text-center">
                      <span className="font-semibold text-green-600">
                        {received}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={
                          remaining === 0
                            ? "font-semibold text-green-600"
                            : "font-semibold text-amber-600"
                        }
                      >
                        {remaining}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      R{" "}
                      {item.unitCost.toLocaleString(
                        "en-ZA",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>

                    <td className="p-4 text-right font-medium">
                      R{" "}
                      {item.lineTotal.toLocaleString(
                        "en-ZA",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-5">
          <h3 className="mb-4 font-semibold text-slate-800">
            Delivery & Notes
          </h3>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-slate-500">
                Expected Delivery
              </span>

              <p className="font-medium">
                {order.expectedDeliveryDate
                  ? new Date(
                      order.expectedDeliveryDate
                    ).toLocaleDateString(
                      "en-ZA"
                    )
                  : "Not specified"}
              </p>
            </div>

            <div>
              <span className="text-slate-500">
                Created By
              </span>

              <p className="font-medium">
                {order.createdBy}
              </p>
            </div>

            {order.notes && (
              <div>
                <span className="text-slate-500">
                  Notes
                </span>

                <p className="mt-1 whitespace-pre-wrap font-medium">
                  {order.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-5">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-500">
                Subtotal
              </span>

              <span className="font-medium">
                R{" "}
                {order.subtotal.toLocaleString(
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
                VAT
              </span>

              <span className="font-medium">
                R{" "}
                {order.vat.toLocaleString(
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
                <span className="text-lg font-semibold">
                  Total
                </span>

                <span className="text-xl font-bold text-blue-700">
                  R{" "}
                  {order.total.toLocaleString(
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

      {order.approvedBy && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <p className="text-sm text-green-700">
            Approved By
          </p>

          <p className="font-semibold text-green-800">
            {order.approvedBy}
          </p>

          {order.approvedDate && (
            <p className="mt-1 text-sm text-green-700">
              {new Date(
                order.approvedDate
              ).toLocaleString("en-ZA")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface InfoBoxProps {
  label: string;
  value: string;
}

function InfoBox({
  label,
  value,
}: InfoBoxProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

interface WorkflowStepProps {
  title: string;
  description: string;
}

function WorkflowStep({
  title,
  description,
}: WorkflowStepProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
        ✓
      </div>

      <h3 className="text-sm font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}