import { supabase } from "@/lib/supabase/client";

export interface VehicleServiceKitRecommendation {
  vehicleVariantId: string;
  serviceKitId: string;
  serviceKitName: string;
  serviceType: string;
  intervalKm: number | null;
  intervalMonths: number | null;
  priority: number;
  notes: string | null;
  items: Array<{
    productId: string;
    sku: string | null;
    productName: string;
    quantity: number;
    required: boolean;
    compatible: boolean;
    fitmentType: string | null;
    verifiedAt: string | null;
    stock: number;
    minimumStock: number;
    supplierName: string | null;
    costPrice: number;
    sellingPrice: number;
  }>;
  totalCost: number;
  totalSellingPrice: number;
  grossProfit: number;
  grossMarginPercent: number;
  readyToSell: boolean;
}

export async function getVehicleServiceKitRecommendations(vehicleVariantId: string): Promise<VehicleServiceKitRecommendation[]> {
  const { data, error } = await supabase
    .from("saip_vehicle_service_kits")
    .select(`
      id,
      interval_km,
      interval_months,
      priority,
      notes,
      service_kit:saip_service_kits!inner(
        id,
        name,
        service_type,
        active,
        items:saip_service_kit_items!inner(
          product_id,
          quantity,
          required,
          product:products!inner(
            sku,
            product_name,
            cost_price,
            selling_price,
            stock,
            minimum_stock,
            supplier:suppliers(company),
            fitments:saip_product_fitments(
              vehicle_variant_id,
              fitment_type,
              verified_at
            )
          )
        )
      )
    `)
    .eq("vehicle_variant_id", vehicleVariantId)
    .eq("active", true)
    .eq("service_kit.active", true)
    .order("priority");

  if (error) throw error;

  return ((data ?? []) as any[]).map((rule) => {
    const items = rule.service_kit.items.map((item: any) => {
      const fitments = item.product.fitments ?? [];
      const fitment = fitments
        .filter((candidate: any) => candidate.vehicle_variant_id === vehicleVariantId)
        .sort((a: any, b: any) => String(b.verified_at ?? "").localeCompare(String(a.verified_at ?? "")))[0];

      return {
        productId: item.product_id,
        sku: item.product.sku,
        productName: item.product.product_name,
        quantity: Number(item.quantity),
        required: Boolean(item.required),
        compatible: Boolean(fitment),
        fitmentType: fitment?.fitment_type ?? null,
        verifiedAt: fitment?.verified_at ?? null,
        stock: Number(item.product.stock ?? 0),
        minimumStock: Number(item.product.minimum_stock ?? 0),
        supplierName: item.product.supplier?.company ?? null,
        costPrice: Number(item.product.cost_price ?? 0),
        sellingPrice: Number(item.product.selling_price ?? 0),
      };
    });

    const totalCost = items.reduce((sum: number, item: any) => sum + item.costPrice * item.quantity, 0);
    const totalSellingPrice = items.reduce((sum: number, item: any) => sum + item.sellingPrice * item.quantity, 0);
    const grossProfit = totalSellingPrice - totalCost;
    const grossMarginPercent = totalSellingPrice > 0 ? (grossProfit / totalSellingPrice) * 100 : 0;
    const readyToSell = items.filter((item: any) => item.required).every((item: any) => item.compatible && item.stock >= item.quantity);

    return {
      vehicleVariantId,
      serviceKitId: rule.service_kit.id,
      serviceKitName: rule.service_kit.name,
      serviceType: rule.service_kit.service_type,
      intervalKm: rule.interval_km == null ? null : Number(rule.interval_km),
      intervalMonths: rule.interval_months == null ? null : Number(rule.interval_months),
      priority: Number(rule.priority ?? 0),
      notes: rule.notes ?? null,
      items,
      totalCost,
      totalSellingPrice,
      grossProfit,
      grossMarginPercent,
      readyToSell,
    };
  });
}
