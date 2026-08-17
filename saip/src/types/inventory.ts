export interface InventoryItem {

  id: string;

  productId: string;

  sku: string;

  productName: string;

  warehouse: string;

  location: string;

  quantityOnHand: number;

  reservedQuantity: number;

  availableQuantity: number;

  reorderLevel: number;

  reorderQuantity: number;

  unitCost: number;

  inventoryValue: number;

  status:
    | "In Stock"
    | "Low Stock"
    | "Out of Stock"
    | "Overstock";

  lastStockMovement: string;

  createdAt: string;

  updatedAt: string;

}