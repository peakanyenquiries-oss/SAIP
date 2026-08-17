import { supabase } from "@/lib/supabase/client";
import { InventoryItem } from "@/types/inventory";

interface InventoryRow {
  id: string;
  product_id: string | null;
  sku: string | null;
  product_name: string | null;
  warehouse: string | null;
  location: string | null;
  quantity_on_hand: number | null;
  reserved_quantity: number | null;
  available_quantity: number | null;
  reorder_level: number | null;
  reorder_quantity: number | null;
  unit_cost: number | null;
  inventory_value: number | null;
  status:
    | "In Stock"
    | "Low Stock"
    | "Out of Stock"
    | "Overstock"
    | null;
  last_stock_movement: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const TABLE_NAME = "inventory";

function mapInventoryRow(
  row: InventoryRow
): InventoryItem {
  return {
    id: row.id,

    productId:
      row.product_id ?? "",

    sku:
      row.sku ?? "",

    productName:
      row.product_name ?? "",

    warehouse:
      row.warehouse ?? "",

    location:
      row.location ?? "",

    quantityOnHand:
      row.quantity_on_hand ?? 0,

    reservedQuantity:
      row.reserved_quantity ?? 0,

    availableQuantity:
      row.available_quantity ?? 0,

    reorderLevel:
      row.reorder_level ?? 0,

    reorderQuantity:
      row.reorder_quantity ?? 0,

    unitCost:
      Number(row.unit_cost ?? 0),

    inventoryValue:
      Number(row.inventory_value ?? 0),

    status:
      row.status ?? "In Stock",

    lastStockMovement:
      row.last_stock_movement ?? "",

    createdAt:
      row.created_at ??
      new Date().toISOString(),

    updatedAt:
      row.updated_at ??
      new Date().toISOString(),
  };
}

function toInventoryRow(
  item: InventoryItem
) {
  return {
    id: item.id,

    product_id:
      item.productId || null,

    sku:
      item.sku,

    product_name:
      item.productName,

    warehouse:
      item.warehouse,

    location:
      item.location,

    quantity_on_hand:
      item.quantityOnHand,

    reserved_quantity:
      item.reservedQuantity,

    available_quantity:
      item.availableQuantity,

    reorder_level:
      item.reorderLevel,

    reorder_quantity:
      item.reorderQuantity,

    unit_cost:
      item.unitCost,

    inventory_value:
      item.inventoryValue,

    status:
      item.status,

    last_stock_movement:
      item.lastStockMovement || null,

    created_at:
      item.createdAt,

    updated_at:
      item.updatedAt ||
      new Date().toISOString(),
  };
}

/* =========================================================
   GET ALL INVENTORY
========================================================= */

export async function getInventory(): Promise<
  InventoryItem[]
> {
  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("updated_at", {
        ascending: false,
      });

  if (error) {
    console.error(
      "Failed to fetch inventory:",
      error
    );

    throw error;
  }

  return (
    (data as InventoryRow[] | null) ?? []
  ).map(mapInventoryRow);
}

/* =========================================================
   GET INVENTORY ITEM
========================================================= */

export async function getInventoryItemById(
  id: string
): Promise<
  InventoryItem | undefined
> {
  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", id)
      .maybeSingle();

  if (error) {
    console.error(
      "Failed to fetch inventory item:",
      error
    );

    throw error;
  }

  if (!data) {
    return undefined;
  }

  return mapInventoryRow(
    data as InventoryRow
  );
}

/* =========================================================
   ADD INVENTORY ITEM
========================================================= */

export async function addInventoryItem(
  item: InventoryItem
): Promise<InventoryItem> {
  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .insert(
        toInventoryRow(item)
      )
      .select()
      .single();

  if (error) {
    console.error(
      "Failed to create inventory item:",
      error
    );

    throw error;
  }

  return mapInventoryRow(
    data as InventoryRow
  );
}

/* =========================================================
   UPDATE INVENTORY ITEM
========================================================= */

export async function updateInventoryItem(
  item: InventoryItem
): Promise<InventoryItem> {
  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .update(
        toInventoryRow(item)
      )
      .eq("id", item.id)
      .select()
      .single();

  if (error) {
    console.error(
      "Failed to update inventory item:",
      error
    );

    throw error;
  }

  return mapInventoryRow(
    data as InventoryRow
  );
}

/* =========================================================
   SAVE INVENTORY
   Compatibility function used by ERP engine
========================================================= */

export async function saveInventory(
  inventory: InventoryItem[]
): Promise<void> {
  if (inventory.length === 0) {
    return;
  }

  const rows =
    inventory.map(
      toInventoryRow
    );

  const { error } =
    await supabase
      .from(TABLE_NAME)
      .upsert(
        rows,
        {
          onConflict: "id",
        }
      );

  if (error) {
    console.error(
      "Failed to save inventory:",
      error
    );

    throw error;
  }
}

/* =========================================================
   DELETE INVENTORY ITEM
========================================================= */

export async function deleteInventoryItem(
  id: string
): Promise<void> {
  const { error } =
    await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", id);

  if (error) {
    console.error(
      "Failed to delete inventory item:",
      error
    );

    throw error;
  }
}

/* =========================================================
   INVENTORY STATISTICS
========================================================= */

export async function getInventoryStatistics(): Promise<{
  totalItems: number;
  totalQuantity: number;
  inventoryValue: number;
  lowStock: number;
  outOfStock: number;
  overstock: number;
}> {
  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .select(
        `
          quantity_on_hand,
          inventory_value,
          status
        `
      );

  if (error) {
    console.error(
      "Failed to fetch inventory statistics:",
      error
    );

    throw error;
  }

  const rows =
    (data ?? []) as Array<{
      quantity_on_hand:
        | number
        | null;

      inventory_value:
        | number
        | null;

      status:
        | string
        | null;
    }>;

  const totalItems =
    rows.length;

  const totalQuantity =
    rows.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.quantity_on_hand ?? 0
        ),
      0
    );

  const inventoryValue =
    rows.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.inventory_value ?? 0
        ),
      0
    );

  const lowStock =
    rows.filter(
      item =>
        item.status ===
        "Low Stock"
    ).length;

  const outOfStock =
    rows.filter(
      item =>
        item.status ===
        "Out of Stock"
    ).length;

  const overstock =
    rows.filter(
      item =>
        item.status ===
        "Overstock"
    ).length;

  return {
    totalItems,
    totalQuantity,
    inventoryValue,
    lowStock,
    outOfStock,
    overstock,
  };
}