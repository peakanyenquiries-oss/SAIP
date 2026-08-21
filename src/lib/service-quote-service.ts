import { supabase } from "@/lib/supabase/client";

export type ServiceQuoteStatus = "DRAFT" | "SENT" | "ACCEPTED" | "DECLINED" | "EXPIRED" | "CONVERTED";

export interface ServiceQuoteItemInput {
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  required?: boolean;
}

export interface CreateServiceQuoteInput {
  customerId: string;
  vehicleVariantId: string;
  serviceKitId: string;
  notes?: string;
  items: ServiceQuoteItemInput[];
}

function money(value: number) { return Math.max(0, Number(value) || 0); }

export async function createServiceQuote(input: CreateServiceQuoteInput) {
  if (!input.customerId || !input.vehicleVariantId || !input.serviceKitId) throw new Error("Customer, vehicle and service kit are required.");
  if (!input.items.length) throw new Error("A service quote must contain at least one item.");

  const items = input.items.map((item) => ({ ...item, quantity: money(item.quantity), unitPrice: money(item.unitPrice), unitCost: money(item.unitCost), required: item.required !== false }));
  if (items.some((item) => item.quantity <= 0)) throw new Error("Quote item quantities must be greater than zero.");

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalCost = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  const grossProfit = subtotal - totalCost;
  const grossMarginPercent = subtotal > 0 ? (grossProfit / subtotal) * 100 : 0;
  const quoteNumber = `SAIP-Q-${Date.now().toString(36).toUpperCase()}`;

  const { data: quote, error: quoteError } = await supabase.from("saip_service_quotes").insert({
    quote_number: quoteNumber,
    customer_id: input.customerId,
    vehicle_variant_id: input.vehicleVariantId,
    service_kit_id: input.serviceKitId,
    status: "DRAFT",
    subtotal,
    total_cost: totalCost,
    gross_profit: grossProfit,
    gross_margin_percent: grossMarginPercent,
    notes: input.notes || null,
  }).select().single();
  if (quoteError) throw quoteError;

  const { error: itemError } = await supabase.from("saip_service_quote_items").insert(items.map((item) => ({
    quote_id: quote.id,
    product_id: item.productId,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    unit_cost: item.unitCost,
    required: item.required,
  })));

  if (itemError) {
    await supabase.from("saip_service_quotes").delete().eq("id", quote.id);
    throw itemError;
  }

  return quote;
}

export async function updateServiceQuoteStatus(id: string, status: ServiceQuoteStatus) {
  const { data, error } = await supabase.from("saip_service_quotes").update({ status, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}
