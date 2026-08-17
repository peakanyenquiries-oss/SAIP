export type StockMovementType =
  | "Opening Balance"
  | "Purchase"
  | "Goods Received"
  | "Sale"
  | "Return"
  | "Transfer In"
  | "Transfer Out"
  | "Adjustment"
  | "Damaged"
  | "Expired";

export interface StockMovement {

  id: string;

  inventoryId: string;

  productId: string;

  sku: string;

  productName: string;

  warehouse: string;

  location: string;

  movementType: StockMovementType;

  quantity: number;

  quantityBefore: number;

  quantityAfter: number;

  unitCost: number;

  totalValue: number;

  referenceNumber: string;

  referenceType: string;

  notes: string;

  performedBy: string;

  movementDate: string;

  createdAt: string;

}