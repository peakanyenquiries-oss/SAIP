"use client";

import { useMemo, useState } from "react";

import {
  Truck,
  PackageCheck,
  Clock3,
  Boxes,
  Plus,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import StatCard from "@/components/ui/StatCard";

import GoodsReceivedTable from "../components/GoodsReceivedTable";
import GoodsReceivedForm from "../components/GoodsReceivedForm";

import usePurchaseOrders from "../hooks/usePurchaseOrders";

import {
  PurchaseOrder,
} from "@/types/purchase-order";

interface GoodsReceivingWorkspaceProps {}

export default function GoodsReceivingWorkspace(
  {}: GoodsReceivingWorkspaceProps
) {
  const {
    orders,
    refresh,
  } = usePurchaseOrders();

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    selectedPurchaseOrder,
    setSelectedPurchaseOrder,
  ] = useState<PurchaseOrder | null>(
    null
  );

  const orderedOrders =
    useMemo(() => {
      return orders.filter(
        (order) =>
          order.status === "Ordered"
      );
    }, [orders]);

  const partiallyReceivedOrders =
    useMemo(() => {
      return orders.filter(
        (order) =>
          order.status ===
          "Partially Received"
      );
    }, [orders]);

  const completedOrders =
    useMemo(() => {
      return orders.filter(
        (order) =>
          order.status ===
          "Completed"
      );
    }, [orders]);

  const outstandingItems =
    useMemo(() => {
      return [
        ...orderedOrders,
        ...partiallyReceivedOrders,
      ].reduce(
        (total, order) =>
          total +
          order.items.length,
        0
      );
    }, [
      orderedOrders,
      partiallyReceivedOrders,
    ]);

  function handleReceive(
    purchaseOrder: PurchaseOrder
  ) {
    setSelectedPurchaseOrder(
      purchaseOrder
    );

    setModalOpen(true);
  }

  async function handleComplete() {
    setModalOpen(false);

    setSelectedPurchaseOrder(
      null
    );

    await refresh();
  }

  function handleNewReceiving() {
    setSelectedPurchaseOrder(
      null
    );

    setModalOpen(true);
  }

  return (
    <div className="space-y-8">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Goods Receiving
          </h1>

          <p className="mt-2 text-slate-500">
            Receive supplier deliveries,
            inspect goods and
            automatically update stock.
          </p>
        </div>

        <Button
          onClick={
            handleNewReceiving
          }
        >
          <Plus size={18} />

          Receive Goods
        </Button>
      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Awaiting Delivery"
          value={
            orderedOrders.length
          }
          subtitle="Purchase Orders"
          icon={
            <Truck size={24} />
          }
          color="blue"
        />

        <StatCard
          title="Partially Received"
          value={
            partiallyReceivedOrders.length
          }
          subtitle="Outstanding"
          icon={
            <Clock3 size={24} />
          }
          color="yellow"
        />

        <StatCard
          title="Completed"
          value={
            completedOrders.length
          }
          subtitle="Received"
          icon={
            <PackageCheck
              size={24}
            />
          }
          color="green"
        />

        <StatCard
          title="Outstanding Items"
          value={
            outstandingItems
          }
          subtitle="Products Waiting"
          icon={
            <Boxes size={24} />
          }
          color="purple"
        />
      </div>

      {/* =================================================
          GOODS RECEIVED TABLE
      ================================================= */}

      <GoodsReceivedTable
        purchaseOrders={[
          ...orderedOrders,
          ...partiallyReceivedOrders,
        ]}
        onReceive={
          handleReceive
        }
      />

      {/* =================================================
          GOODS RECEIVING MODAL
      ================================================= */}

      <Modal
        open={modalOpen}
        title="Receive Goods"
        onClose={() => {
          setModalOpen(false);

          setSelectedPurchaseOrder(
            null
          );
        }}
        width="xl"
      >
        <GoodsReceivedForm
          purchaseOrders={
            selectedPurchaseOrder
              ? [
                  selectedPurchaseOrder,
                ]
              : []
          }
          onComplete={
            handleComplete
          }
        />
      </Modal>
    </div>
  );
}