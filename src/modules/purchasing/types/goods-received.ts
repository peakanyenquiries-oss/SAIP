export interface GoodsReceivedItem {

  productId: string;

  inventoryId: string;

  sku: string;

  productName: string;

  orderedQuantity: number;

  receivedQuantity: number;

  remainingQuantity: number;

  unitCost: number;

}

export interface GoodsReceivedNote {

  id: string;

  grnNumber: string;

  purchaseOrderId: string;

  supplierId: string;

  supplierName: string;

  warehouse: string;

  receivedDate: string;

  receivedBy: string;

  referenceNumber: string;

  notes: string;

  items: GoodsReceivedItem[];

  totalValue: number;

  createdAt: string;

}