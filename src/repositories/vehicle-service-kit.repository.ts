import { supabase } from "@/lib/supabase/client";

export interface VehicleServiceKitRepositoryRow {
  id: string;
  intervalKm: number | null;
  intervalMonths: number | null;
  priority: number;
  notes: string | null;
  serviceKit: {
    id: string;
    name: string;
    serviceType: string;
    active: boolean;
    items: Array<{
      productId: string;
      quantity: number;
      required: boolean;
      product: {
        sku: string | null;
        productName: string;
        costPrice: number | string | null;
        sellingPrice: number | string | null;
        stock: number | null;
        minimumStock: number | null;
        supplierName: string | null;
        fitments: Array<{
          vehicleVariantId: string;
          fitmentType: string | null;
          verifiedAt: string | null;
        }>;
      };
    }>;
  };
}

export async function fetchVehicleServiceKitRules(vehicleVariantId: string): Promise<VehicleServiceKitRepositoryRow[]> {
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

  return ((data ?? []) as any[]).map((rule) => ({
    id: rule.id,
    intervalKm: rule.interval_km == null ? null : Number(rule.interval_km),
    intervalMonths: rule.interval_months == null ? null : Number(rule.interval_months),
    priority: Number(rule.priority ?? 0),
    notes: rule.notes ?? null,
    serviceKit: {
      id: rule.service_kit.id,
      name: rule.service_kit.name,
      serviceType: rule.service_kit.service_type,
      active: Boolean(rule.service_kit.active),
      items: rule.service_kit.items.map((item: any) => ({
        productId: item.product_id,
        quantity: Number(item.quantity),
        required: Boolean(item.required),
        product: {
          sku: item.product.sku,
          productName: item.product.product_name,
          costPrice: item.product.cost_price,
          sellingPrice: item.product.selling_price,
          stock: item.product.stock,
          minimumStock: item.product.minimum_stock,
          supplierName: item.product.supplier?.company ?? null,
          fitments: (item.product.fitments ?? []).map((fitment: any) => ({
            vehicleVariantId: fitment.vehicle_variant_id,
            fitmentType: fitment.fitment_type ?? null,
            verifiedAt: fitment.verified_at ?? null,
          })),
        },
      })),
    },
  }));
}
