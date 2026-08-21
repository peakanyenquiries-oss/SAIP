import { supabase } from "@/lib/supabase/client";

export interface ServiceKitItem {
  id: string;
  productId: string;
  sku: string | null;
  productName: string;
  quantity: number;
  required: boolean;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minimumStock: number;
}

export interface ServiceKitSummary {
  id: string;
  name: string;
  description: string | null;
  serviceType: string;
  active: boolean;
  items: ServiceKitItem[];
  totalCost: number;
  totalSellingPrice: number;
  grossProfit: number;
  grossMarginPercent: number;
  stockReady: boolean;
}

export async function getServiceKitSummary(serviceKitId: string): Promise<ServiceKitSummary | null> {
  const { data, error } = await supabase
    .from("saip_service_kits")
    .select(`
      id,
      name,
      description,
      service_type,
      active,
      items:saip_service_kit_items(
        id,
        product_id,
        quantity,
        required,
        product:products!inner(
          sku,
          product_name,
          cost_price,
          selling_price,
          stock,
          minimum_stock
        )
      )
    `)
    .eq("id", serviceKitId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const items = ((data.items ?? []) as any[]).map((item) => ({
    id: item.id,
    productId: item.product_id,
    sku: item.product.sku,
    productName: item.product.product_name,
    quantity: Number(item.quantity),
    required: Boolean(item.required),
    costPrice: Number(item.product.cost_price ?? 0),
    sellingPrice: Number(item.product.selling_price ?? 0),
    stock: Number(item.product.stock ?? 0),
    minimumStock: Number(item.product.minimum_stock ?? 0),
  }));

  const totalCost = items.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
  const totalSellingPrice = items.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  const grossProfit = totalSellingPrice - totalCost;
  const grossMarginPercent = totalSellingPrice > 0 ? (grossProfit / totalSellingPrice) * 100 : 0;
  const stockReady = items.filter((item) => item.required).every((item) => item.stock >= item.quantity);

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    serviceType: data.service_type,
    active: data.active,
    items,
    totalCost,
    totalSellingPrice,
    grossProfit,
    grossMarginPercent,
    stockReady,
  };
}

export async function getServiceKits(): Promise<ServiceKitSummary[]> {
  const { data, error } = await supabase.from("saip_service_kits").select("id").eq("active", true).order("name");
  if (error) throw error;
  const summaries = await Promise.all((data ?? []).map((row) => getServiceKitSummary(row.id)));
  return summaries.filter((summary): summary is ServiceKitSummary => summary !== null);
}
