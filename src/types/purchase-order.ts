export type PurchaseOrderStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Ordered"
  | "Partially Received"
  | "Completed"
  | "Cancelled";

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  quantity: number;
  receivedQuantity: number;
  unitCost: number;
  lineTotal: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;

  supplierId: string;
  supplierName: string;

  orderDate: string;
  expectedDeliveryDate: string;

  status: PurchaseOrderStatus;

  items: PurchaseOrderItem[];

  subtotal: number;
  vat: number;
  total: number;

  notes: string;

  createdBy: string;
  createdAt: string;
  updatedAt: string;

  approvedBy?: string;
  approvedDate?: string;
}