"use client";

import { useCallback, useEffect, useState } from "react";

import { PurchaseOrder, PurchaseOrderStatus } from "@/types/purchase-order";
import {
  addPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderById,
  getPurchaseOrders,
  updatePurchaseOrder,
} from "@/modules/purchasing/services/purchase-supabase.service";
import {
  receivePurchaseOrder,
  updatePurchaseOrderStatus,
} from "@/repositories/purchase-workflow.repository";

interface PurchaseOrderStatistics {
  totalOrders: number;
  draft: number;
  pendingApproval: number;
  approved: number;
  ordered: number;
  partiallyReceived: number;
  completed: number;
  cancelled: number;
  outstanding: number;
  totalValue: number;
}

export default function usePurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [statistics, setStatistics] = useState<PurchaseOrderStatistics>({
    totalOrders: 0,
    draft: 0,
    pendingApproval: 0,
    approved: 0,
    ordered: 0,
    partiallyReceived: 0,
    completed: 0,
    cancelled: 0,
    outstanding: 0,
    totalValue: 0,
  });

  const calculateStatistics = useCallback((orders: PurchaseOrder[]) => {
    setStatistics({
      totalOrders: orders.length,
      draft: orders.filter((o) => o.status === "Draft").length,
      pendingApproval: orders.filter((o) => o.status === "Pending Approval").length,
      approved: orders.filter((o) => o.status === "Approved").length,
      ordered: orders.filter((o) => o.status === "Ordered").length,
      partiallyReceived: orders.filter((o) => o.status === "Partially Received").length,
      completed: orders.filter((o) => o.status === "Completed").length,
      cancelled: orders.filter((o) => o.status === "Cancelled").length,
      outstanding: orders.filter((o) => !["Completed", "Cancelled"].includes(o.status)).length,
      totalValue: orders.reduce((total, order) => total + Number(order.total || 0), 0),
    });
  }, []);

  const load = useCallback(async () => {
    try {
      const orders = await getPurchaseOrders();
      setPurchaseOrders(orders);
      calculateStatistics(orders);
    } catch (error) {
      console.error("Failed to load purchase orders:", error);
      setPurchaseOrders([]);
      calculateStatistics([]);
    }
  }, [calculateStatistics]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(async (order: PurchaseOrder) => {
    const saved = await addPurchaseOrder(order);
    await load();
    return saved;
  }, [load]);

  const update = useCallback(async (order: PurchaseOrder) => {
    const saved = await updatePurchaseOrder(order);
    await load();
    return saved;
  }, [load]);

  const remove = useCallback(async (id: string) => {
    await deletePurchaseOrder(id);
    await load();
  }, [load]);

  const getById = useCallback(async (id: string) => getPurchaseOrderById(id), []);

  const changeStatus = useCallback(async (id: string, status: PurchaseOrderStatus) => {
    const result = await updatePurchaseOrderStatus(id, status);
    if (result.success) await load();
    return result.success;
  }, [load]);

  const submitForApproval = useCallback(
    async (id: string) => changeStatus(id, "Pending Approval"),
    [changeStatus]
  );

  const approve = useCallback(
    async (id: string, _approvedBy: string) => changeStatus(id, "Approved"),
    [changeStatus]
  );

  const markOrdered = useCallback(
    async (id: string) => changeStatus(id, "Ordered"),
    [changeStatus]
  );

  const markPartiallyReceived = useCallback(
    async (id: string) => changeStatus(id, "Partially Received"),
    [changeStatus]
  );

  const markCompleted = useCallback(
    async (id: string) => changeStatus(id, "Completed"),
    [changeStatus]
  );

  const receiveGoods = useCallback(async (
    id: string,
    receivedQuantities: Record<string, number>
  ) => {
    const result = await receivePurchaseOrder(id, receivedQuantities);
    if (result.success) await load();
    return result;
  }, [load]);

  const cancel = useCallback(
    async (id: string) => changeStatus(id, "Cancelled"),
    [changeStatus]
  );

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
