import { supabase } from "@/lib/supabase";

export type ProcurementRecommendation = {
  inventory_id: string;
  product_id: string;
  sku: string;
  product_name: string;
  warehouse: string;
  location: string;
  available_quantity: number;
  reorder_level: number;
  daily_demand: number;
  days_of_cover: number | null;
  supplier_id: string | null;
  supplier_name: string | null;
  supplier_score: number;
  landed_unit_cost: number;
  minimum_order_qty: number;
  lead_time_days: number;
  recommended_order_quantity: number;
  recommended_order_value: number;
  recommendation: "ORDER_NOW" | "EXPEDITE_REVIEW" | "MONITOR";
  rationale: string;
};

export type ProcurementRequest = {
  id: string;
  product_id: string;
  product_name: string;
  sku: string;
  requested_quantity: number;
  status: string;
  recommended_supplier_id: string | null;
  supplier_name: string | null;
  decision_score: number | null;
  recommended_landed_cost: number | null;
  recommended_selling_price: number | null;
  rationale: string | null;
  purchase_order_id: string | null;
  created_at: string;
  updated_at: string;
};

export async function getReplenishmentRecommendations(): Promise<ProcurementRecommendation[]> {
  const { data, error } = await supabase.rpc(
    "saip_get_replenishment_recommendations",
    { p_product_id: null }
  );

  if (error) throw error;

  const rows = Array.isArray(data) ? data : [];

  return rows.map((row) => ({
    inventory_id: String(row.inventory_id ?? ""),
    product_id: String(row.product_id ?? ""),
    sku: String(row.sku ?? ""),
    product_name: String(row.product_name ?? ""),
    warehouse: String(row.warehouse ?? ""),
    location: String(row.location ?? ""),
    available_quantity: Number(row.available_quantity ?? 0),
    reorder_level: Number(row.reorder_level ?? 0),
    daily_demand: Number(row.daily_demand ?? 0),
    days_of_cover: row.days_of_cover == null ? null : Number(row.days_of_cover),
    supplier_id: row.supplier_id ?? null,
    supplier_name: row.supplier_name ?? null,
    supplier_score: Number(row.supplier_score ?? 0),
    landed_unit_cost: Number(row.landed_unit_cost ?? 0),
    minimum_order_qty: Number(row.minimum_order_qty ?? 0),
    lead_time_days: Number(row.lead_time_days ?? 0),
    recommended_order_quantity: Number(row.recommended_order_quantity ?? 0),
    recommended_order_value: Number(row.recommended_order_value ?? 0),
    recommendation: row.recommendation,
    rationale: String(row.rationale ?? ""),
  }));
}

export async function getProcurementRequests(): Promise<ProcurementRequest[]> {
  const { data, error } = await supabase
    .from("saip_procurement_requests")
    .select(`
      id,
      product_id,
      requested_quantity,
      status,
      recommended_supplier_id,
      decision_score,
      recommended_landed_cost,
      recommended_selling_price,
      rationale,
      purchase_order_id,
      created_at,
      updated_at,
      products!saip_procurement_requests_product_id_fkey (
        product_name,
        sku
      ),
      suppliers!saip_procurement_requests_recommended_supplier_id_fkey (
        company
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    product_id: row.product_id,
    product_name: row.products?.product_name ?? "Unknown product",
    sku: row.products?.sku ?? "",
    requested_quantity: Number(row.requested_quantity ?? 0),
    status: row.status,
    recommended_supplier_id: row.recommended_supplier_id ?? null,
    supplier_name: row.suppliers?.company ?? null,
    decision_score: row.decision_score == null ? null : Number(row.decision_score),
    recommended_landed_cost:
      row.recommended_landed_cost == null ? null : Number(row.recommended_landed_cost),
    recommended_selling_price:
      row.recommended_selling_price == null ? null : Number(row.recommended_selling_price),
    rationale: row.rationale ?? null,
    purchase_order_id: row.purchase_order_id ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

export async function createProcurementRequest(
  productId: string,
  quantity: number
): Promise<string> {
  const { data, error } = await supabase.rpc(
    "saip_create_procurement_request",
    {
      p_product_id: productId,
      p_quantity: Math.floor(Number(quantity)),
    }
  );

  if (error) throw error;
  return String(data);
}

export async function approveProcurementRequest(requestId: string): Promise<void> {
  const { error } = await supabase.rpc(
    "saip_approve_procurement_request",
    { p_request_id: requestId }
  );

  if (error) throw error;
}

export async function convertApprovedProcurementRequestToPo(
  requestId: string,
  createdBy = "SAIP User"
): Promise<string> {
  const { data, error } = await supabase.rpc(
    "saip_convert_approved_procurement_request_to_po",
    {
      p_request_id: requestId,
      p_created_by: createdBy,
    }
  );

  if (error) throw error;
  return String(data);
}
