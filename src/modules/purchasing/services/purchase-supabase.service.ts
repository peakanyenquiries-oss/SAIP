import { supabase } from "@/lib/supabase";
import { PurchaseOrder } from "@/types/purchase-order";

function mapItem(row: any) {
  return {
    id: row.id,
    productId: row.product_id ?? "",
    sku: row.sku ?? "",
    productName: row.product_name ?? "",
    quantity: Number(row.quantity ?? 0),
    receivedQuantity: Number(row.received_quantity ?? 0),
    unitCost: Number(row.unit_cost ?? 0),
    lineTotal: Number(row.line_total ?? 0),
  };
}

function mapOrder(row: any): PurchaseOrder {
  return {
    id: row.id,
    poNumber: row.po_number,
    supplierId: row.supplier_id ?? "",
    supplierName: row.supplier_name ?? "",
    orderDate: row.order_date,
    expectedDeliveryDate: row.expected_delivery_date ?? "",
    status: row.status,
    subtotal: Number(row.subtotal ?? 0),
    vat: Number(row.vat ?? 0),
    total: Number(row.total ?? 0),
    createdBy: row.created_by ?? "SAIP User",
    approvedBy: row.approved_by ?? undefined,
    approvedDate: row.approved_date ?? undefined,
    notes: row.notes ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items: (row.purchase_order_items ?? []).map(mapItem),
  };
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  const { data, error } = await supabase
    .from("purchase_orders")
    .select(`
      *,
      purchase_order_items (*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load purchase orders:", error);
    throw error;
  }

  return (data ?? []).map(mapOrder);
}

export async function getPurchaseOrderById(
  id: string
): Promise<PurchaseOrder | undefined> {
  const { data, error } = await supabase
    .from("purchase_orders")
    .select(`
      *,
      purchase_order_items (*)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load purchase order:", error);
    throw error;
  }

  return data ? mapOrder(data) : undefined;
}

export async function addPurchaseOrder(
  order: PurchaseOrder
): Promise<PurchaseOrder> {
  const { data, error } = await supabase
    .from("purchase_orders")
    .insert({
      id: order.id || undefined,
      po_number: order.poNumber,
      supplier_id: order.supplierId || null,
      supplier_name: order.supplierName,
      order_date: order.orderDate,
      expected_delivery_date: order.expectedDeliveryDate || null,
      status: order.status,
      subtotal: order.subtotal,
      vat: order.vat,
      total: order.total,
      created_by: order.createdBy,
      approved_by: order.approvedBy ?? null,
      approved_date: order.approvedDate ?? null,
      notes: order.notes ?? null,
      created_at: order.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create purchase order:", error);
    throw error;
  }

  if (order.items.length > 0) {
    const { error: itemError } = await supabase
      .from("purchase_order_items")
      .insert(
        order.items.map((item) => ({
          id: item.id || undefined,
          purchase_order_id: data.id,
          product_id: item.productId || null,
          sku: item.sku,
          product_name: item.productName,
          quantity: item.quantity,
          received_quantity: item.receivedQuantity ?? 0,
          unit_cost: item.unitCost,
          line_total: item.lineTotal,
        }))
      );

    if (itemError) {
      await supabase.from("purchase_orders").delete().eq("id", data.id);
      throw itemError;
    }
  }

  const saved = await getPurchaseOrderById(data.id);

  if (!saved) {
    throw new Error("Purchase order was created but could not be loaded.");
  }

  return saved;
}

export async function updatePurchaseOrder(
  order: PurchaseOrder
): Promise<PurchaseOrder> {
  const { error } = await supabase
    .from("purchase_orders")
    .update({
      po_number: order.poNumber,
      supplier_id: order.supplierId || null,
      supplier_name: order.supplierName,
      order_date: order.orderDate,
      expected_delivery_date: order.expectedDeliveryDate || null,
      status: order.status,
      subtotal: order.subtotal,
      vat: order.vat,
      total: order.total,
      created_by: order.createdBy,
      approved_by: order.approvedBy ?? null,
      approved_date: order.approvedDate ?? null,
      notes: order.notes ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  if (error) {
    throw error;
  }

  const { error: deleteItemsError } = await supabase
    .from("purchase_order_items")
    .delete()
    .eq("purchase_order_id", order.id);

  if (deleteItemsError) {
    throw deleteItemsError;
  }

  if (order.items.length > 0) {
    const { error: itemError } = await supabase
      .from("purchase_order_items")
      .insert(
        order.items.map((item) => ({
          id: item.id || undefined,
          purchase_order_id: order.id,
          product_id: item.productId || null,
          sku: item.sku,
          product_name: item.productName,
          quantity: item.quantity,
          received_quantity: item.receivedQuantity ?? 0,
          unit_cost: item.unitCost,
          line_total: item.lineTotal,
        }))
      );

    if (itemError) {
      throw itemError;
    }
  }

  const saved = await getPurchaseOrderById(order.id);

  if (!saved) {
    throw new Error("Purchase order was updated but could not be loaded.");
  }

  return saved;
}

export async function deletePurchaseOrder(id: string): Promise<void> {
  const { error } = await supabase
    .from("purchase_orders")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export interface ReceivePurchaseOrderResult {
  success: boolean;
  message: string;
  purchaseOrderId?: string;
  status?: string;
  receiptId?: string;
  receiptNumber?: string;
  totalQuantity?: number;
  totalValue?: number;
}

export async function receivePurchaseOrder(
  purchaseOrderId: string,
  receivedQuantities: Record<string, number>
): Promise<ReceivePurchaseOrderResult> {
  const cleanQuantities: Record<string, number> = {};

  for (const [itemId, quantity] of Object.entries(receivedQuantities)) {
    const numericQuantity = Number(quantity);

    if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
      continue;
    }

    cleanQuantities[itemId] = Math.floor(numericQuantity);
  }

  if (Object.keys(cleanQuantities).length === 0) {
    return {
      success: false,
      message: "No valid receiving quantities were supplied.",
    };
  }

  const { data, error } = await supabase.rpc(
    "saip_receive_purchase_order_atomic",
    {
      p_purchase_order_id: purchaseOrderId,
      p_received_quantities: cleanQuantities,
      p_received_by: "SAIP User",
      p_warehouse: "Main Warehouse",
      p_notes: null,
    }
  );

  if (error) {
    console.error("Failed to receive purchase order:", error);
    return {
      success: false,
      message: error.message || "Failed to receive goods.",
    };
  }

  const result = Array.isArray(data) ? data[0] : data;

  if (!result?.success) {
    return {
      success: false,
      message: result?.message ?? "The purchase receipt was not completed.",
      purchaseOrderId: result?.purchaseOrderId ?? purchaseOrderId,
      status: result?.status,
      receiptId: result?.receiptId,
      receiptNumber: result?.receiptNumber,
      totalQuantity: Number(result?.totalQuantity ?? 0),
      totalValue: Number(result?.totalValue ?? 0),
    };
  }

  return {
    success: true,
    message: result.receiptNumber
      ? `Goods received successfully. GRN ${result.receiptNumber} created.`
      : "Goods received successfully.",
    purchaseOrderId: result.purchaseOrderId ?? purchaseOrderId,
    status: result.status,
    receiptId: result.receiptId,
    receiptNumber: result.receiptNumber,
    totalQuantity: Number(result.totalQuantity ?? 0),
    totalValue: Number(result.totalValue ?? 0),
  };
}
