import { supabase } from "@/lib/supabase/client";

export interface VehicleVariantRow {
  id: string;
  model_type: string;
  engine_code: string | null;
  engine_cc: number | null;
  power_kw: number | null;
  year_from_month: string | null;
  year_to_month: string | null;
  model: {
    model_name: string;
    generation: string | null;
    make: { make_name: string };
  };
}

export interface ProductFitmentRow {
  id: string;
  fitment_type: string;
  verified_at: string | null;
  notes: string | null;
  product: {
    id: string;
    sku: string | null;
    product_name: string;
    brand: string | null;
    cost_price: number | string | null;
    selling_price: number | string | null;
    stock: number | null;
    minimum_stock: number | null;
    supplier_id: string | null;
    supplier: { company: string } | null;
    procurement_recommendations: Array<{
      id: string;
      recommended_supplier_id: string | null;
      reason: string;
      score: number | string;
      created_at: string | null;
      recommended_supplier: { company: string } | null;
    }>;
    supplier_options: Array<{
      supplier_id: string;
      unit_cost: number | string;
      is_preferred: boolean;
      lead_time_days: number;
      supplier: { company: string } | null;
    }>;
  };
}

export async function fetchVehicleVariants(): Promise<VehicleVariantRow[]> {
  const { data, error } = await supabase
    .from("saip_vehicle_variants")
    .select(`
      id,
      model_type,
      engine_code,
      engine_cc,
      power_kw,
      year_from_month,
      year_to_month,
      model:saip_vehicle_models!inner(
        model_name,
        generation,
        make:saip_vehicle_makes!inner(make_name)
      )
    `)
    .order("model_type");

  if (error) throw error;
  return (data ?? []) as unknown as VehicleVariantRow[];
}

export async function fetchCompatibleProducts(vehicleVariantId: string): Promise<ProductFitmentRow[]> {
  const { data, error } = await supabase
    .from("saip_product_fitments")
    .select(`
      id,
      fitment_type,
      verified_at,
      notes,
      product:products!inner(
        id,
        sku,
        product_name,
        brand,
        cost_price,
        selling_price,
        stock,
        minimum_stock,
        supplier_id,
        supplier:suppliers(company),
        procurement_recommendations:saip_procurement_recommendations!saip_procurement_recommendations_product_id_fkey(
          id,
          recommended_supplier_id,
          reason,
          score,
          created_at,
          recommended_supplier:suppliers(company)
        ),
        supplier_options:product_suppliers(
          supplier_id,
          unit_cost,
          is_preferred,
          lead_time_days,
          supplier:suppliers(company)
        )
      )
    `)
    .eq("vehicle_variant_id", vehicleVariantId)
    .order("verified_at", { ascending: false, nullsFirst: false });

  if (error) throw error;
  return (data ?? []) as unknown as ProductFitmentRow[];
}
