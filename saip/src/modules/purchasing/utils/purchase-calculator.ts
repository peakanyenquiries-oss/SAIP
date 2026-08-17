import { PurchaseOrderItem } from "@/types/purchase-order";

export function calculatePurchaseTotals(
  items: PurchaseOrderItem[],
  vatRate = 0.15
) {

  const subtotal =
    items.reduce(

      (total, item) =>

        total +

        item.lineTotal,

      0

    );

  const vat =
    subtotal * vatRate;

  const total =
    subtotal + vat;

  return {

    subtotal,

    vat,

    total,

  };

}

export function calculateLineTotal(

  quantity: number,

  unitCost: number

) {

  return quantity * unitCost;

}