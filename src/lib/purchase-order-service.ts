import { PurchaseOrder } from "@/types/purchase-order";

const STORAGE_KEY = "saip-purchase-orders";

export function getPurchaseOrders(): PurchaseOrder[] {

  if (typeof window === "undefined")
    return [];

  const data =
    localStorage.getItem(STORAGE_KEY);

  if (!data)
    return [];

  try {

    return JSON.parse(data);

  } catch {

    return [];

  }

}

export function savePurchaseOrders(
  orders: PurchaseOrder[]
) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(orders)
  );

}

export function addPurchaseOrder(
  order: PurchaseOrder
) {

  const orders =
    getPurchaseOrders();

  orders.unshift(order);

  savePurchaseOrders(orders);

}

export function updatePurchaseOrder(
  order: PurchaseOrder
) {

  const orders =
    getPurchaseOrders().map(

      current =>

        current.id === order.id

          ? order

          : current

    );

  savePurchaseOrders(orders);

}

export function deletePurchaseOrder(
  id: string
) {

  const orders =
    getPurchaseOrders().filter(

      order =>

        order.id !== id

    );

  savePurchaseOrders(orders);

}

export function getPurchaseOrderById(
  id: string
) {

  return getPurchaseOrders().find(

    order =>

      order.id === id

  );

}

export function generatePurchaseOrderNumber() {

  const orders =
    getPurchaseOrders();

  const nextNumber =
    orders.length + 1;

  return `PO-${nextNumber
    .toString()
    .padStart(6, "0")}`;

}

export function getPurchaseStatistics() {

  const orders =
    getPurchaseOrders();

  const totalOrders =
    orders.length;

  const draft =
    orders.filter(

      order =>

        order.status === "Draft"

    ).length;

  const approved =
    orders.filter(

      order =>

        order.status === "Approved"

    ).length;

  const completed =
    orders.filter(

      order =>

        order.status === "Completed"

    ).length;

  const outstanding =
    orders.filter(

      order =>

        order.status !== "Completed"

        &&

        order.status !== "Cancelled"

    ).length;

  const totalValue =
    orders.reduce(

      (total, order) =>

        total +

        order.total,

      0

    );

  return {

    totalOrders,

    draft,

    approved,

    completed,

    outstanding,

    totalValue,

  };

}