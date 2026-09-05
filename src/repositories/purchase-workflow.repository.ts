import { supabase } from "@/lib/supabase";
import { PurchaseOrderStatus } from "@/types/purchase-order";

export interface PurchaseWorkflowResult {
  success: boolean;
  message: string;
  status?: PurchaseOrderStatus;
  receiptId?: string;
}

export async function updatePurchaseOrderStatus(
  purchaseOrderId: string,
  status: PurchaseOrderStatus,
  performedBy = "SAIP User"
): Promise<PurchaseWorkflowResult> {
  const { data, error } = await supabase.rpc(
    "saip_update_purchase_order_status",
    {
      p_purchase_order_id: purchaseOrderId,
      p_new_status: status,
      p_performed_by: performedBy,
    }
  );

  if (error) {
    return {
      success: false,
      message: error.message || "Purchase order status update failed.",
    };
  }

  return {
    success: true,
    message: `Purchase order moved to ${data?.status ?? status}.`,
    status: (data?.status ?? status) as PurchaseOrderStatus,
  };
}

export async function receivePurchaseOrder(
  purchaseOrderId: string,
  receivedQuantities: Record<string, number>,
  receivedBy = "SAIP User"
): Promise<PurchaseWorkflowResult> {
  const cleanQuantities: Record<string, number> = {};

  for (const [itemId, quantity] of Object.entries(receivedQuantities)) {
    const numericQuantity = Number(quantity);
    if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) continue;
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
      p_received_by: receivedBy,
      p_warehouse: "Main Warehouse",
      p_notes: null,
    }
  );

  if (error) {
    return {
      success: false,
      message: error.message || "Failed to receive goods.",
    };
  }

  const result = Array.isArray(data) ? data[0] : data;
  const reconciliation = result?.reconciliation;
  const receiptId = result?.receipt_id ?? result?.receiptId;
  const status = reconciliation?.status as PurchaseOrderStatus | undefined;

  return {
    success: result?.success !== false,
    message:
      result?.success === false
        ? result?.message ?? "The purchase receipt was not completed."
        : receiptId
          ? `Goods received successfully. Receipt ${receiptId} created.`
          : "Goods received successfully.",
    receiptId,
    status,
  };
}
