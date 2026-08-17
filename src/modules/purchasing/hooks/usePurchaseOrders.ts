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

import {
  getProductById,
  updateProduct,
} from "@/lib/product-service";

interface ReceiveGoodsResult {
  success: boolean;
  message: string;
}

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
  const [
    purchaseOrders,
    setPurchaseOrders,
  ] = useState<PurchaseOrder[]>([]);

  const [
    statistics,
    setStatistics,
  ] = useState<PurchaseOrderStatistics>({
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

  const calculateStatistics = useCallback(
    (orders: PurchaseOrder[]) => {
      const draft = orders.filter(
        (order) =>
          order.status === "Draft"
      ).length;

      const pendingApproval =
        orders.filter(
          (order) =>
            order.status ===
            "Pending Approval"
        ).length;

      const approved = orders.filter(
        (order) =>
          order.status === "Approved"
      ).length;

      const ordered = orders.filter(
        (order) =>
          order.status === "Ordered"
      ).length;

      const partiallyReceived =
        orders.filter(
          (order) =>
            order.status ===
            "Partially Received"
        ).length;

      const completed = orders.filter(
        (order) =>
          order.status === "Completed"
      ).length;

      const cancelled = orders.filter(
        (order) =>
          order.status === "Cancelled"
      ).length;

      const outstanding = orders.filter(
        (order) =>
          order.status !==
            "Completed" &&
          order.status !==
            "Cancelled"
      ).length;

      const totalValue = orders.reduce(
        (total, order) =>
          total +
          Number(order.total || 0),
        0
      );

      setStatistics({
        totalOrders:
          orders.length,
        draft,
        pendingApproval,
        approved,
        ordered,
        partiallyReceived,
        completed,
        cancelled,
        outstanding,
        totalValue,
      });
    },
    []
  );

  const load = useCallback(
    async () => {
      try {
        const orders =
          await getPurchaseOrders();

        setPurchaseOrders(orders);

        calculateStatistics(
          orders
        );
      } catch (error) {
        console.error(
          "Failed to load purchase orders:",
          error
        );

        setPurchaseOrders([]);

        calculateStatistics([]);
      }
    },
    [calculateStatistics]
  );

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(
    async (
      order: PurchaseOrder
    ) => {
      const savedOrder =
        await addPurchaseOrder(
          order
        );

      await load();

      return savedOrder;
    },
    [load]
  );

  const update = useCallback(
    async (
      order: PurchaseOrder
    ) => {
      const savedOrder =
        await updatePurchaseOrder(
          order
        );

      await load();

      return savedOrder;
    },
    [load]
  );

  const remove = useCallback(
    async (id: string) => {
      await deletePurchaseOrder(
        id
      );

      await load();
    },
    [load]
  );

  const getById = useCallback(
    async (
      id: string
    ) => {
      return getPurchaseOrderById(
        id
      );
    },
    []
  );

  const changeStatus = useCallback(
    async (
      id: string,
      status: PurchaseOrderStatus
    ) => {
      const order =
        await getPurchaseOrderById(
          id
        );

      if (!order) {
        return false;
      }

      const updatedOrder:
        PurchaseOrder = {
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
    },
    [load]
  );

  const submitForApproval =
    useCallback(
      async (id: string) => {
        const order =
          await getPurchaseOrderById(
            id
          );

        if (!order) {
          return false;
        }

        if (
          order.status !==
          "Draft"
        ) {
          return false;
        }

        return changeStatus(
          id,
          "Pending Approval"
        );
      },
      [changeStatus]
    );

  const approve = useCallback(
    async (
      id: string,
      approvedBy: string
    ) => {
      const order =
        await getPurchaseOrderById(
          id
        );

      if (!order) {
        return false;
      }

      if (
        order.status !==
        "Pending Approval"
      ) {
        return false;
      }

      const now =
        new Date().toISOString();

      const updatedOrder:
        PurchaseOrder = {
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
    },
    [load]
  );

  const markOrdered = useCallback(
    async (id: string) => {
      const order =
        await getPurchaseOrderById(
          id
        );

      if (!order) {
        return false;
      }

      if (
        order.status !==
        "Approved"
      ) {
        return false;
      }

      return changeStatus(
        id,
        "Ordered"
      );
    },
    [changeStatus]
  );

  const markPartiallyReceived =
    useCallback(
      async (id: string) => {
        const order =
          await getPurchaseOrderById(
            id
          );

        if (!order) {
          return false;
        }

        if (
          order.status !==
            "Ordered" &&
          order.status !==
            "Partially Received"
        ) {
          return false;
        }

        return changeStatus(
          id,
          "Partially Received"
        );
      },
      [changeStatus]
    );

  const markCompleted =
    useCallback(
      async (id: string) => {
        const order =
          await getPurchaseOrderById(
            id
          );

        if (!order) {
          return false;
        }

        if (
          order.status !==
            "Ordered" &&
          order.status !==
            "Partially Received"
        ) {
          return false;
        }

        return changeStatus(
          id,
          "Completed"
        );
      },
      [changeStatus]
    );

  const receiveGoods = useCallback(
    async (
      id: string,
      receivedQuantities:
        Record<string, number>
    ): Promise<ReceiveGoodsResult> => {
      const order =
        await getPurchaseOrderById(
          id
        );

      if (!order) {
        return {
          success: false,
          message:
            "Purchase order not found.",
        };
      }

      if (
        order.status !==
          "Ordered" &&
        order.status !==
          "Partially Received"
      ) {
        return {
          success: false,
          message:
            "Goods can only be received for an Ordered or Partially Received purchase order.",
        };
      }

      const receiptEntries =
        Object.entries(
          receivedQuantities
        ).filter(
          ([, quantity]) =>
            Number(quantity) > 0
        );

      if (
        receiptEntries.length ===
        0
      ) {
        return {
          success: false,
          message:
            "No goods were selected for receiving.",
        };
      }

      /*
       * ------------------------------------------------------
       * STEP 1
       * Validate the requested receipt against the PO.
       * ------------------------------------------------------
       */

      for (const [
        itemId,
        quantity,
      ] of receiptEntries) {
        const item =
          order.items.find(
            (currentItem) =>
              currentItem.id ===
              itemId
          );

        if (!item) {
          return {
            success: false,
            message:
              "One or more receiving items could not be found.",
          };
        }

        const requested =
          Math.floor(
            Number(quantity)
          );

        const alreadyReceived =
          Number(
            item.receivedQuantity ??
              0
          );

        const remaining =
          Math.max(
            0,
            Number(item.quantity) -
              alreadyReceived
          );

        if (
          !Number.isFinite(
            requested
          ) ||
          requested < 0 ||
          requested > remaining
        ) {
          return {
            success: false,
            message:
              `Invalid receiving quantity for ${item.productName}. Maximum remaining quantity is ${remaining}.`,
          };
        }
      }

      /*
       * ------------------------------------------------------
       * STEP 2
       * Update inventory quantities.
       *
       * The PO item is linked to a Product through productId.
       * Every successfully received quantity is added to
       * the product's current stock.
       * ------------------------------------------------------
       */

      const inventoryUpdates:
        Array<{
          productId: string;
          quantity: number;
        }> = [];

      for (const [
        itemId,
        quantity,
      ] of receiptEntries) {
        const item =
          order.items.find(
            (currentItem) =>
              currentItem.id ===
              itemId
          );

        if (!item) {
          continue;
        }

        const received =
          Math.floor(
            Number(quantity)
          );

        if (
          received <= 0
        ) {
          continue;
        }

        inventoryUpdates.push({
          productId:
            item.productId,
          quantity: received,
        });
      }

      /*
       * Update products one by one.
       *
       * We deliberately fetch the latest product record before
       * changing stock so we do not rely on a potentially stale
       * browser copy.
       */

      for (const update of inventoryUpdates) {
        const product =
          await getProductById(
            update.productId
          );

        if (!product) {
          return {
            success: false,
            message:
              `Product ${update.productId} could not be found. The receipt was not completed.`,
          };
        }

        const updatedProduct = {
          ...product,
          quantity:
            Number(
              product.quantity ?? 0
            ) +
            update.quantity,
          updatedAt:
            new Date().toISOString(),
        };

        await updateProduct(
          updatedProduct
        );
      }

      /*
       * ------------------------------------------------------
       * STEP 3
       * Update the quantities received against the PO.
       * ------------------------------------------------------
       */

      const updatedItems =
        order.items.map(
          (item) => {
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
                item.receivedQuantity ??
                  0
              );

            const remaining =
              Math.max(
                0,
                Number(
                  item.quantity
                ) -
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
          }
        );

      const fullyReceived =
        updatedItems.every(
          (item) =>
            Number(
              item.receivedQuantity ??
                0
            ) >=
            Number(item.quantity)
        );

      const hasReceived =
        updatedItems.some(
          (item) =>
            Number(
              item.receivedQuantity ??
                0
            ) > 0
        );

      let newStatus:
        PurchaseOrderStatus =
        order.status;

      if (fullyReceived) {
        newStatus =
          "Completed";
      } else if (hasReceived) {
        newStatus =
          "Partially Received";
      }

      const updatedOrder:
        PurchaseOrder = {
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
          ? "All goods received. Purchase order completed and inventory updated."
          : "Goods received successfully and inventory updated.",
      };
    },
    [load]
  );

  const cancel = useCallback(
    async (id: string) => {
      const order =
        await getPurchaseOrderById(
          id
        );

      if (!order) {
        return false;
      }

      if (
        order.status ===
          "Completed" ||
        order.status ===
          "Cancelled"
      ) {
        return false;
      }

      return changeStatus(
        id,
        "Cancelled"
      );
    },
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