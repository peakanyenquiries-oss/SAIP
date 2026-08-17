import { PurchaseOrder } from "@/types/purchase-order";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePurchaseOrder(
  order: PurchaseOrder
): ValidationResult {

  const errors: string[] = [];

  if (!order.supplierId) {
    errors.push("Supplier is required.");
  }

  if (order.items.length === 0) {
    errors.push("At least one product is required.");
  }

  order.items.forEach((item, index) => {

    if (!item.productId) {
      errors.push(
        `Line ${index + 1}: Product is required.`
      );
    }

    if (item.quantity <= 0) {
      errors.push(
        `Line ${index + 1}: Quantity must be greater than zero.`
      );
    }

    if (item.unitCost < 0) {
      errors.push(
        `Line ${index + 1}: Invalid unit cost.`
      );
    }

  });

  if (order.total < 0) {
    errors.push("Order total cannot be negative.");
  }

  return {

    valid: errors.length === 0,

    errors,

  };

}

export function isPurchaseOrderComplete(
  order: PurchaseOrder
): boolean {

  return (
    order.supplierId.length > 0 &&
    order.items.length > 0 &&
    order.total > 0
  );

}