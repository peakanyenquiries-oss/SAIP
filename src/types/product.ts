export interface Product {

  id: string;

  sku: string;

  name: string;

  brand: string;

  category: string;

  supplierId: string;

  costPrice: number;

  sellingPrice: number;

  quantity: number;

  minimumStock: number;

  barcode: string;

  status:
    | "Active"
    | "Inactive"
    | "Discontinued";

  createdAt: string;

  updatedAt: string;

}