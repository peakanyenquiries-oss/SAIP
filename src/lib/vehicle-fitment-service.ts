import { fetchCompatibleProducts, fetchVehicleVariants } from "@/repositories/vehicle-fitment.repository";

export interface VehicleVariant {
  id: string;
  make: string;
  model: string;
  generation: string | null;
  variant: string;
  engineCode: string | null;
  engineCc: number | null;
  powerKw: number | null;
  yearFrom: string | null;
  yearTo: string | null;
}

export interface CompatibleProduct {
  fitmentId: string;
  productId: string;
  sku: string | null;
  productName: string;
  brand: string | null;
  fitmentType: string;
  verifiedAt: string | null;
  notes: string | null;
  supplierId: string | null;
  supplierName: string | null;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minimumStock: number;
}

export async function getVehicleVariants(): Promise<VehicleVariant[]> {
  const rows = await fetchVehicleVariants();
  return rows.map((row) => ({
    id: row.id,
    make: row.model.make.make_name,
    model: row.model.model_name,
    generation: row.model.generation,
    variant: row.model_type,
    engineCode: row.engine_code,
    engineCc: row.engine_cc,
    powerKw: row.power_kw,
    yearFrom: row.year_from_month,
    yearTo: row.year_to_month,
  }));
}

export async function getCompatibleProducts(vehicleVariantId: string): Promise<CompatibleProduct[]> {
  const rows = await fetchCompatibleProducts(vehicleVariantId);
  return rows.map((row) => ({
    fitmentId: row.id,
    productId: row.product.id,
    sku: row.product.sku,
    productName: row.product.product_name,
    brand: row.product.brand,
    fitmentType: row.fitment_type,
    verifiedAt: row.verified_at,
    notes: row.notes,
    supplierId: row.product.supplier_id,
    supplierName: row.product.supplier?.company ?? null,
    costPrice: Number(row.product.cost_price ?? 0),
    sellingPrice: Number(row.product.selling_price ?? 0),
    stock: Number(row.product.stock ?? 0),
    minimumStock: Number(row.product.minimum_stock ?? 0),
  }));
}
