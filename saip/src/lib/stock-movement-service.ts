import { supabase } from "@/lib/supabase/client";
import { StockMovement } from "@/types/stock-movement";

interface StockMovementRow {
  id: string;

  inventory_id: string | null;

  product_id: string | null;

  sku: string | null;

  product_name: string | null;

  warehouse: string | null;

  location: string | null;

  movement_type: StockMovement["movementType"];

  quantity: number | null;

  quantity_before: number | null;

  quantity_after: number | null;

  unit_cost: number | null;

  total_value: number | null;

  reference_number: string | null;

  reference_type: string | null;

  notes: string | null;

  performed_by: string | null;

  movement_date: string | null;

  created_at: string | null;
}

const TABLE_NAME = "stock_movements";

/* =========================================================
   DATABASE → APPLICATION
========================================================= */

function mapStockMovementRow(
  row: StockMovementRow
): StockMovement {
  return {
    id: row.id,

    inventoryId:
      row.inventory_id ?? "",

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

    movementType:
      row.movement_type,

    quantity:
      row.quantity ?? 0,

    quantityBefore:
      row.quantity_before ?? 0,

    quantityAfter:
      row.quantity_after ?? 0,

    unitCost:
      Number(row.unit_cost ?? 0),

    totalValue:
      Number(row.total_value ?? 0),

    referenceNumber:
      row.reference_number ?? "",

    referenceType:
      row.reference_type ?? "",

    notes:
      row.notes ?? "",

    performedBy:
      row.performed_by ?? "",

    movementDate:
      row.movement_date ??
      new Date().toISOString(),

    createdAt:
      row.created_at ??
      new Date().toISOString(),
  };
}

/* =========================================================
   APPLICATION → DATABASE
========================================================= */

function toStockMovementRow(
  movement: StockMovement
) {
  return {
    id:
      movement.id,

    inventory_id:
      movement.inventoryId || null,

    product_id:
      movement.productId || null,

    sku:
      movement.sku,

    product_name:
      movement.productName,

    warehouse:
      movement.warehouse,

    location:
      movement.location,

    movement_type:
      movement.movementType,

    quantity:
      movement.quantity,

    quantity_before:
      movement.quantityBefore,

    quantity_after:
      movement.quantityAfter,

    unit_cost:
      movement.unitCost,

    total_value:
      movement.totalValue,

    reference_number:
      movement.referenceNumber || null,

    reference_type:
      movement.referenceType || null,

    notes:
      movement.notes || null,

    performed_by:
      movement.performedBy || null,

    movement_date:
      movement.movementDate,

    created_at:
      movement.createdAt ||
      new Date().toISOString(),
  };
}

/* =========================================================
   GET ALL STOCK MOVEMENTS
========================================================= */

export async function getStockMovements(): Promise<
  StockMovement[]
> {
  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("movement_date", {
        ascending: false,
      });

  if (error) {
    console.error(
      "Failed to fetch stock movements:",
      error
    );

    throw error;
  }

  return (
    (data as StockMovementRow[] | null) ?? []
  ).map(
    mapStockMovementRow
  );
}

/* =========================================================
   GET MOVEMENT BY ID
========================================================= */

export async function getStockMovementById(
  id: string
): Promise<
  StockMovement | undefined
> {
  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("id", id)
      .maybeSingle();

  if (error) {
    console.error(
      "Failed to fetch stock movement:",
      error
    );

    throw error;
  }

  if (!data) {
    return undefined;
  }

  return mapStockMovementRow(
    data as StockMovementRow
  );
}

/* =========================================================
   GET MOVEMENTS FOR INVENTORY ITEM
========================================================= */

export async function getStockMovementsByInventoryId(
  inventoryId: string
): Promise<StockMovement[]> {
  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq(
        "inventory_id",
        inventoryId
      )
      .order("movement_date", {
        ascending: false,
      });

  if (error) {
    console.error(
      "Failed to fetch inventory movements:",
      error
    );

    throw error;
  }

  return (
    (data as StockMovementRow[] | null) ?? []
  ).map(
    mapStockMovementRow
  );
}

/* =========================================================
   GET MOVEMENTS FOR PRODUCT
========================================================= */

export async function getStockMovementsByProductId(
  productId: string
): Promise<StockMovement[]> {
  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq(
        "product_id",
        productId
      )
      .order("movement_date", {
        ascending: false,
      });

  if (error) {
    console.error(
      "Failed to fetch product movements:",
      error
    );

    throw error;
  }

  return (
    (data as StockMovementRow[] | null) ?? []
  ).map(
    mapStockMovementRow
  );
}

/* =========================================================
   ADD STOCK MOVEMENT
========================================================= */

export async function addStockMovement(
  movement: StockMovement
): Promise<StockMovement> {
  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .insert(
        toStockMovementRow(
          movement
        )
      )
      .select()
      .single();

  if (error) {
    console.error(
      "Failed to create stock movement:",
      error
    );

    throw error;
  }

  return mapStockMovementRow(
    data as StockMovementRow
  );
}

/* =========================================================
   SAVE STOCK MOVEMENTS
   Compatibility function
========================================================= */

export async function saveStockMovements(
  movements: StockMovement[]
): Promise<void> {
  if (
    movements.length === 0
  ) {
    return;
  }

  const rows =
    movements.map(
      toStockMovementRow
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
      "Failed to save stock movements:",
      error
    );

    throw error;
  }
}

/* =========================================================
   DELETE STOCK MOVEMENT
========================================================= */

export async function deleteStockMovement(
  id: string
): Promise<void> {
  const { error } =
    await supabase
      .from(TABLE_NAME)
      .delete()
      .eq("id", id);

  if (error) {
    console.error(
      "Failed to delete stock movement:",
      error
    );

    throw error;
  }
}

/* =========================================================
   STOCK MOVEMENT STATISTICS
========================================================= */

export async function getStockMovementStatistics(): Promise<{
  totalMovements: number;
  totalQuantityMoved: number;
  totalValueMoved: number;
  purchases: number;
  sales: number;
  adjustments: number;
  transfers: number;
}> {
  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .select(
        `
          movement_type,
          quantity,
          total_value
        `
      );

  if (error) {
    console.error(
      "Failed to fetch stock movement statistics:",
      error
    );

    throw error;
  }

  const rows =
    (data ?? []) as Array<{
      movement_type:
        | string
        | null;

      quantity:
        | number
        | null;

      total_value:
        | number
        | null;
    }>;

  const totalMovements =
    rows.length;

  const totalQuantityMoved =
    rows.reduce(
      (
        total,
        row
      ) =>
        total +
        Number(
          row.quantity ?? 0
        ),
      0
    );

  const totalValueMoved =
    rows.reduce(
      (
        total,
        row
      ) =>
        total +
        Number(
          row.total_value ?? 0
        ),
      0
    );

  const purchases =
    rows.filter(
      row =>
        row.movement_type ===
          "Purchase" ||
        row.movement_type ===
          "Goods Received"
    ).length;

  const sales =
    rows.filter(
      row =>
        row.movement_type ===
        "Sale"
    ).length;

  const adjustments =
    rows.filter(
      row =>
        row.movement_type ===
        "Adjustment"
    ).length;

  const transfers =
    rows.filter(
      row =>
        row.movement_type ===
          "Transfer In" ||
        row.movement_type ===
          "Transfer Out"
    ).length;

  return {
    totalMovements,

    totalQuantityMoved,

    totalValueMoved,

    purchases,

    sales,

    adjustments,

    transfers,
  };
}