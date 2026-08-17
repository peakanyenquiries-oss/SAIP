import { supabase } from "@/lib/supabase/client";
import { Product } from "@/types/product";

interface ProductRow {
  id: string;
  sku: string | null;
  product_name: string;
  brand: string | null;
  category: string | null;
  oem_number: string | null;
  selling_price: number | null;
  cost_price: number | null;
  stock: number | null;
  created_at: string | null;
  updated_at: string | null;
}

const TABLE_NAME = "products";

/* =========================================================
   DATABASE → APPLICATION
   ========================================================= */

function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,

    sku: row.sku ?? "",

    name: row.product_name ?? "",

    brand: row.brand ?? "",

    category: row.category ?? "",

    supplierId: "",

    costPrice: Number(row.cost_price ?? 0),

    sellingPrice: Number(row.selling_price ?? 0),

    quantity: Number(row.stock ?? 0),

    minimumStock: 0,

    barcode: row.oem_number ?? "",

    status: "Active",

    createdAt:
      row.created_at ?? new Date().toISOString(),

    updatedAt:
      row.updated_at ?? new Date().toISOString(),
  };
}

/* =========================================================
   APPLICATION → DATABASE
   ========================================================= */

function toProductRow(product: Product) {
  return {
    id: product.id,

    sku: product.sku || null,

    product_name: product.name,

    brand: product.brand || null,

    category: product.category || null,

    oem_number: product.barcode || null,

    selling_price: product.sellingPrice,

    cost_price: product.costPrice,

    stock: product.quantity,

    created_at:
      product.createdAt || new Date().toISOString(),

    updated_at:
      product.updatedAt || new Date().toISOString(),
  };
}

/* =========================================================
   GET PRODUCTS
   ========================================================= */

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .order("updated_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "[product-service] getProducts failed:",
      error
    );

    throw error;
  }

  return ((data as ProductRow[] | null) ?? []).map(
    mapProductRow
  );
}

/* =========================================================
   GET PRODUCT BY ID
   ========================================================= */

export async function getProductById(
  id: string
): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(
      "[product-service] getProductById failed:",
      error
    );

    throw error;
  }

  if (!data) {
    return undefined;
  }

  return mapProductRow(data as ProductRow);
}

/* =========================================================
   ADD PRODUCT
   ========================================================= */

export async function addProduct(
  product: Product
): Promise<Product> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(toProductRow(product))
    .select()
    .single();

  if (error) {
    console.error(
      "[product-service] addProduct failed:",
      error
    );

    throw error;
  }

  return mapProductRow(data as ProductRow);
}

/* =========================================================
   UPDATE PRODUCT
   ========================================================= */

export async function updateProduct(
  product: Product
): Promise<Product> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      sku: product.sku || null,

      product_name: product.name,

      brand: product.brand || null,

      category: product.category || null,

      oem_number: product.barcode || null,

      selling_price: product.sellingPrice,

      cost_price: product.costPrice,

      stock: product.quantity,

      updated_at:
        product.updatedAt ||
        new Date().toISOString(),
    })
    .eq("id", product.id)
    .select()
    .single();

  if (error) {
    console.error(
      "[product-service] updateProduct failed:",
      error
    );

    throw error;
  }

  return mapProductRow(data as ProductRow);
}

/* =========================================================
   SAVE PRODUCTS
   Used by ERP Engine
   ========================================================= */

export async function saveProducts(
  products: Product[]
): Promise<void> {
  if (products.length === 0) {
    return;
  }

  const rows = products.map(toProductRow);

  const { error } = await supabase
    .from(TABLE_NAME)
    .upsert(rows, {
      onConflict: "id",
    });

  if (error) {
    console.error(
      "[product-service] saveProducts failed:",
      error
    );

    throw error;
  }
}

/* =========================================================
   DELETE PRODUCT
   ========================================================= */

export async function deleteProduct(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "[product-service] deleteProduct failed:",
      error
    );

    throw error;
  }
}

/* =========================================================
   PRODUCT STATISTICS
   ========================================================= */

export async function getProductStatistics(): Promise<{
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  discontinuedProducts: number;
  lowStockProducts: number;
  inventoryValue: number;
}> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(
      `
        id,
        stock,
        cost_price
      `
    );

  if (error) {
    console.error(
      "[product-service] getProductStatistics failed:",
      error
    );

    throw error;
  }

  const rows =
    (data ?? []) as Array<{
      id: string;
      stock: number | null;
      cost_price: number | null;
    }>;

  const totalProducts = rows.length;

  const activeProducts = rows.filter(
    (product) =>
      Number(product.stock ?? 0) > 0
  ).length;

  const inactiveProducts = 0;

  const discontinuedProducts = 0;

  const lowStockProducts = rows.filter(
    (product) =>
      Number(product.stock ?? 0) <= 0
  ).length;

  const inventoryValue = rows.reduce(
    (total, product) =>
      total +
      Number(product.cost_price ?? 0) *
        Number(product.stock ?? 0),
    0
  );

  return {
    totalProducts,
    activeProducts,
    inactiveProducts,
    discontinuedProducts,
    lowStockProducts,
    inventoryValue,
  };
}