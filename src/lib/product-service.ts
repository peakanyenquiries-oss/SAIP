import { supabase } from "@/lib/supabase/client";
import { Product } from "@/types/product";

interface ProductRow {
  id: string;
  sku: string | null;
  product_name: string;
  brand: string | null;
  category: string | null;
  oem_number: string | null;
  selling_price: number | null;
  cost_price: number | null;
  stock: number | null;
  minimum_stock?: number | null;
  supplier_id?: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface SupplierOption {
  id: string;
  company: string;
  status: string | null;
}

export interface ProductPriceAnalysis {
  costPrice: number;
  sellingPrice: number;
  grossProfit: number;
  grossMarginPercent: number;
  markupPercent: number;
  targetPriceAt25Margin: number;
  targetPriceAt30Margin: number;
  targetPriceAt35Margin: number;
}

const TABLE_NAME = "products";

function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    sku: row.sku ?? "",
    name: row.product_name ?? "",
    brand: row.brand ?? "",
    category: row.category ?? "",
    supplierId: row.supplier_id ?? "",
    costPrice: Number(row.cost_price ?? 0),
    sellingPrice: Number(row.selling_price ?? 0),
    quantity: Number(row.stock ?? 0),
    minimumStock: Number(row.minimum_stock ?? 0),
    barcode: row.oem_number ?? "",
    status: "Active",
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

function toProductRow(product: Product) {
  return {
    id: product.id,
    sku: product.sku || null,
    product_name: product.name,
    brand: product.brand || null,
    category: product.category || null,
    oem_number: product.barcode || null,
    selling_price: product.sellingPrice,
    cost_price: product.costPrice,
    stock: product.quantity,
    minimum_stock: product.minimumStock,
    supplier_id: product.supplierId || null,
    created_at: product.createdAt || new Date().toISOString(),
    updated_at: product.updatedAt || new Date().toISOString(),
  };
}

function priceForMargin(cost: number, marginPercent: number) {
  if (cost <= 0 || marginPercent >= 100) return 0;
  return cost / (1 - marginPercent / 100);
}

export function analyseProductPricing(costPrice: number, sellingPrice: number): ProductPriceAnalysis {
  const cost = Math.max(0, Number(costPrice) || 0);
  const selling = Math.max(0, Number(sellingPrice) || 0);
  const grossProfit = selling - cost;
  const grossMarginPercent = selling > 0 ? (grossProfit / selling) * 100 : 0;
  const markupPercent = cost > 0 ? (grossProfit / cost) * 100 : 0;

  return {
    costPrice: cost,
    sellingPrice: selling,
    grossProfit,
    grossMarginPercent,
    markupPercent,
    targetPriceAt25Margin: priceForMargin(cost, 25),
    targetPriceAt30Margin: priceForMargin(cost, 30),
    targetPriceAt35Margin: priceForMargin(cost, 35),
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from(TABLE_NAME).select("*").order("updated_at", { ascending: false });
  if (error) throw error;
  return ((data as ProductRow[] | null) ?? []).map(mapProductRow);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const { data, error } = await supabase.from(TABLE_NAME).select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapProductRow(data as ProductRow) : undefined;
}

export async function getSupplierOptions(): Promise<SupplierOption[]> {
  const { data, error } = await supabase.from("suppliers").select("id, company, status").order("company", { ascending: true });
  if (error) throw error;
  return (data ?? []) as SupplierOption[];
}

export async function addProduct(product: Product): Promise<Product> {
  const { data, error } = await supabase.from(TABLE_NAME).insert(toProductRow(product)).select().single();
  if (error) throw error;
  return mapProductRow(data as ProductRow);
}

export async function updateProduct(product: Product): Promise<Product> {
  const { data, error } = await supabase.from(TABLE_NAME).update(toProductRow(product)).eq("id", product.id).select().single();
  if (error) throw error;
  return mapProductRow(data as ProductRow);
}

export async function saveProducts(products: Product[]): Promise<void> {
  if (!products.length) return;
  const { error } = await supabase.from(TABLE_NAME).upsert(products.map(toProductRow), { onConflict: "id" });
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE_NAME).delete().eq("id", id);
  if (error) throw error;
}

export async function getProductStatistics(): Promise<{
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  discontinuedProducts: number;
  lowStockProducts: number;
  inventoryValue: number;
  missingCommercialData: number;
}> {
  const { data, error } = await supabase.from(TABLE_NAME).select("id, stock, cost_price, selling_price, minimum_stock");
  if (error) throw error;

  const rows = (data ?? []) as Array<{ id: string; stock: number | null; cost_price: number | null; selling_price: number | null; minimum_stock: number | null }>;
  const totalProducts = rows.length;
  const activeProducts = rows.filter((p) => Number(p.stock ?? 0) > 0 && Number(p.selling_price ?? 0) > 0).length;
  const inactiveProducts = rows.filter((p) => Number(p.selling_price ?? 0) <= 0).length;
  const discontinuedProducts = 0;
  const lowStockProducts = rows.filter((p) => Number(p.stock ?? 0) <= Number(p.minimum_stock ?? 0)).length;
  const inventoryValue = rows.reduce((total, p) => total + Number(p.cost_price ?? 0) * Number(p.stock ?? 0), 0);
  const missingCommercialData = rows.filter((p) => p.cost_price == null || p.selling_price == null).length;

  return { totalProducts, activeProducts, inactiveProducts, discontinuedProducts, lowStockProducts, inventoryValue, missingCommercialData };
}
