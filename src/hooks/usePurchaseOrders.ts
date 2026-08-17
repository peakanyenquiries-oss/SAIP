"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  PurchaseOrder,
  PurchaseOrderStatus,
} from "@/types/purchase-order";

import {
  addPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderById,
  getPurchaseOrders,
  updatePurchaseOrder,
} from "@/modules/purchasing/services/purchase-supabase.service";

export default function usePurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] =
    useState<PurchaseOrder[]>([]);

  const [statistics, setStatistics] =
    useState({
      totalOrders: 0,
      draft: 0,
      approved: 0,
      completed: 0,
      outstanding: 0,
      totalValue: 0,
    });

  const calculateStatistics = useCallback(
    (orders: PurchaseOrder[]) => {
      const draft = orders.filter(
        (order) =>
          order.status === "Draft"
      ).length;

      const approved = orders.filter(
        (order) =>
          order.status === "Approved"
      ).length;

      const completed = orders.filter(
        (order) =>
          order.status === "Completed"
      ).length;

      const outstanding = orders.filter(
        (order) =>
          order.status !== "Completed" &&
          order.status !== "Cancelled"
      ).length;

      const totalValue = orders.reduce(
        (total, order) =>
          total + Number(order.total || 0),
        0
      );

      setStatistics({
        totalOrders: orders.length,
        draft,
        approved,
        completed,
        outstanding,
        totalValue,
      });
    },
    []
  );

  const load = useCallback(async () => {
    try {
      const orders =
        await getPurchaseOrders();

      setPurchaseOrders(orders);

      calculateStatistics(orders);
    } catch (error) {
      console.error(
        "Failed to load purchase orders:",
        error
      );

      setPurchaseOrders([]);

      calculateStatistics([]);
    }
  }, [calculateStatistics]);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(
    order: PurchaseOrder
  ) {
    await addPurchaseOrder(order);
    await load();
  }

  async function update(
    order: PurchaseOrder
  ) {
    await updatePurchaseOrder(order);
    await load();
  }

  async function remove(
    id: string
  ) {
    await deletePurchaseOrder(id);
    await load();
  }

  async function getById(
    id: string
  ) {
    return getPurchaseOrderById(id);
  }

  async function changeStatus(
    id: string,
    status: PurchaseOrderStatus
  ) {
    const order =
      await getPurchaseOrderById(id);

    if (!order) {
      return false;
    }

    const updatedOrder: PurchaseOrder = {
      ...order,
      status,
      updatedAt:
        new Date().toISOString(),
    };

    await updatePurchaseOrder(
      updatedOrder
    );

    await load();

    return true;
  }

  async function submitForApproval(
    id: string
  ) {
    return changeStatus(
      id,
      "Pending Approval"
    );
  }

  async function approve(
    id: string,
    approvedBy: string
  ) {
    const order =
      await getPurchaseOrderById(id);

    if (!order) {
      return false;
    }

    const now =
      new Date().toISOString();

    const updatedOrder: PurchaseOrder = {
      ...order,
      status: "Approved",
      approvedBy,
      approvedDate: now,
      updatedAt: now,
    };

    await updatePurchaseOrder(
      updatedOrder
    );

    await load();

    return true;
  }

  async function markOrdered(
    id: string
  ) {
    return changeStatus(
      id,
      "Ordered"
    );
  }

  async function markPartiallyReceived(
    id: string
  ) {
    return changeStatus(
      id,
      "Partially Received"
    );
  }

  async function markCompleted(
    id: string
  ) {
    return changeStatus(
      id,
      "Completed"
    );
  }

  async function receiveGoods(
    id: string,
    receivedQuantities: Record<
      string,
      number
    >
  ) {
    const order =
      await getPurchaseOrderById(id);

    if (!order) {
      return {
        success: false,
        message:
          "Purchase order not found.",
      };
    }

    const updatedItems =
      order.items.map((item) => {
        const requestedQuantity =
          Number(
            receivedQuantities[
              item.id
            ] ?? 0
          );

        const receivedNow =
          Number.isFinite(
            requestedQuantity
          )
            ? Math.max(
                0,
                Math.floor(
                  requestedQuantity
                )
              )
            : 0;

        const currentReceived =
          Number(
            item.receivedQuantity ?? 0
          );

        const remaining =
          Math.max(
            0,
            item.quantity -
              currentReceived
          );

        const actualReceived =
          Math.min(
            receivedNow,
            remaining
          );

        return {
          ...item,
          receivedQuantity:
            currentReceived +
            actualReceived,
        };
      });

    const fullyReceived =
      updatedItems.every(
        (item) =>
          Number(
            item.receivedQuantity ?? 0
          ) >= Number(item.quantity)
      );

    const hasReceived =
      updatedItems.some(
        (item) =>
          Number(
            item.receivedQuantity ?? 0
          ) > 0
      );

    let newStatus:
      PurchaseOrderStatus =
      order.status;

    if (fullyReceived) {
      newStatus = "Completed";
    } else if (hasReceived) {
      newStatus =
        "Partially Received";
    }

    const updatedOrder: PurchaseOrder = {
      ...order,
      items: updatedItems,
      status: newStatus,
      updatedAt:
        new Date().toISOString(),
    };

    await updatePurchaseOrder(
      updatedOrder
    );

    await load();

    return {
      success: true,
      message: fullyReceived
        ? "All goods received. Purchase order completed."
        : "Goods received successfully.",
    };
  }

  async function cancel(
    id: string
  ) {
    return changeStatus(
      id,
      "Cancelled"
    );
  }

  return {
    purchaseOrders,
    statistics,

    create,
    update,
    remove,

    getById,

    changeStatus,

    submitForApproval,
    approve,

    markOrdered,
    markPartiallyReceived,
    markCompleted,

    receiveGoods,

    cancel,

    refresh: load,
  };
}