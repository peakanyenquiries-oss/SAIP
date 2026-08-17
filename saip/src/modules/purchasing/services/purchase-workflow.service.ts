import { PurchaseOrder } from "@/types/purchase-order";

export type PurchaseStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Ordered"
  | "Partially Received"
  | "Completed"
  | "Cancelled";

const transitions: Record<
  PurchaseStatus,
  PurchaseStatus[]
> = {
  Draft: [
    "Pending Approval",
    "Cancelled",
  ],

  "Pending Approval": [
    "Approved",
    "Cancelled",
  ],

  Approved: [
    "Ordered",
    "Cancelled",
  ],

  Ordered: [
    "Partially Received",
    "Completed",
  ],

  "Partially Received": [
    "Completed",
  ],

  Completed: [],

  Cancelled: [],
};

export function getNextStatuses(
  status: PurchaseStatus
) {
  return transitions[status];
}

export function canTransition(
  current: PurchaseStatus,
  next: PurchaseStatus
) {
  return transitions[current].includes(next);
}

export function updatePurchaseStatus(
  order: PurchaseOrder,
  next: PurchaseStatus
): PurchaseOrder {

  if (
    !canTransition(
      order.status as PurchaseStatus,
      next
    )
  ) {
    throw new Error(
      `Invalid transition from ${order.status} to ${next}`
    );
  }

  return {
    ...order,
    status: next,
    updatedAt: new Date().toISOString(),
  };
}