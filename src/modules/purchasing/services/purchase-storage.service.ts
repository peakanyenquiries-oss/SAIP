import { PurchaseOrder } from "@/types/purchase-order";

import {
  getPurchaseOrders as getPurchaseOrdersFromSupabase,
  getPurchaseOrderById as getPurchaseOrderByIdFromSupabase,
  addPurchaseOrder as addPurchaseOrderToSupabase,
  updatePurchaseOrder as updatePurchaseOrderInSupabase,
  deletePurchaseOrder as deletePurchaseOrderFromSupabase,
} from "@/modules/purchasing/services/purchase-supabase.service";

/**
 * =========================================================
 * PURCHASE ORDER STORAGE SERVICE
 * =========================================================
 *
 * Central storage gateway for the Purchasing module.
 *
 * The Purchasing UI and hook use this service instead of
 * accessing Supabase directly.
 * =========================================================
 */

/**
 * GET ALL PURCHASE ORDERS
 */
export async function getPurchaseOrders(): Promise<
  PurchaseOrder[]
> {
  return getPurchaseOrdersFromSupabase();
}

/**
 * GET PURCHASE ORDER BY ID
 */
export async function getPurchaseOrderById(
  id: string
): Promise<PurchaseOrder | undefined> {
  return getPurchaseOrderByIdFromSupabase(id);
}

/**
 * ADD PURCHASE ORDER
 */
export async function addPurchaseOrder(
  order: PurchaseOrder
): Promise<PurchaseOrder> {
  return addPurchaseOrderToSupabase(order);
}

/**
 * UPDATE PURCHASE ORDER
 */
export async function updatePurchaseOrder(
  order: PurchaseOrder
): Promise<PurchaseOrder> {
  return updatePurchaseOrderInSupabase(order);
}

/**
 * DELETE PURCHASE ORDER
 */
export async function deletePurchaseOrder(
  id: string
): Promise<void> {
  await deletePurchaseOrderFromSupabase(id);
}

/**
 * GENERATE PURCHASE ORDER NUMBER
 */
export async function generatePurchaseOrderNumber(): Promise<string> {
  const orders = await getPurchaseOrders();

  const highestNumber = orders.reduce(
    (highest, order) => {
      const match = order.poNumber.match(
        /^PO-(\d+)$/
      );

      if (!match) {
        return highest;
      }

      const number = Number(match[1]);

      if (!Number.isFinite(number)) {
        return highest;
      }

      return Math.max(
        highest,
        number
      );
    },
    0
  );

  return `PO-${String(
    highestNumber + 1
  ).padStart(6, "0")}`;
}