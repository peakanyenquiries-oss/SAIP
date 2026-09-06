import { supabase } from "@/lib/supabase/client";

export interface ServiceKitRepositoryItem {
  id: string;
  productId: string;
  sku: string | null;
  productName: string;
  quantity: number;
  required: boolean;
  costPrice: number | string | null;
  sellingPrice: number | string | null;
  stock: number | null;
  minimumStock: number | null;
}

export interface ServiceKitRepositoryRow {
  id: string;
  name: string;
  description: string | null;
  serviceType: string;
  active: boolean;
  items: ServiceKitRepositoryItem[];
}

export async function fetchActiveServiceKitIds(): Promise<string[]> {
  const { data, error } = await supabase
    .from("saip_service_kits")
    .select("id")
    .eq("active", true)
    .order("name");

  if (error) throw error;
  return (data ?? []).map((row) => row.id as string);
}

export async function fetchServiceKitSummary(serviceKitId: string): Promise<ServiceKitRepositoryRow | null> {
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

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    serviceType: data.service_type,
    active: Boolean(data.active),
    items: ((data.items ?? []) as any[]).map((item) => ({
      id: item.id,
      productId: item.product_id,
      sku: item.product.sku,
      productName: item.product.product_name,
      quantity: Number(item.quantity),
      required: Boolean(item.required),
      costPrice: item.product.cost_price,
      sellingPrice: item.product.selling_price,
      stock: item.product.stock,
      minimumStock: item.product.minimum_stock,
    })),
  };
}
