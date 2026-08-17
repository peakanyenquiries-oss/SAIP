import { supabase } from "@/lib/supabase";
import { PurchaseOrder } from "@/types/purchase-order";

function mapItem(row: any) {
  return {
    id: row.id,
    productId: row.product_id ?? "",
    sku: row.sku ?? "",
    productName: row.product_name ?? "",
    quantity: Number(row.quantity ?? 0),
    receivedQuantity: Number(row.received