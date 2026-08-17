import { supabase } from "@/lib/supabase/client";
import { Supplier } from "@/types/supplier";

const TABLE = "suppliers";

function mapDatabaseToSupplier(row: any): Supplier {
  return {
    id: row.id,
    company: row.company,
    contactPerson: row.contact_person ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    province: row.province ?? "",
    paymentTerms: row.payment_terms ?? "",
    supplierScore: row.supplier_score ?? 0,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSupplierToDatabase(supplier: Supplier) {
  return {
    id: supplier.id,
    company: supplier.company,
    contact_person: supplier.contactPerson,
    phone: supplier.phone,
    email: supplier.email,
    province: supplier.province,
    payment_terms: supplier.paymentTerms,
    supplier_score: supplier.supplierScore,
    status: supplier.status,
    created_at: supplier.createdAt,
    updated_at: supplier.updatedAt,
  };
}

export async function getSuppliers(): Promise<Supplier[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("company", { ascending: true });

  if (error) {
    console.error("Error loading suppliers:", error);
    return [];
  }

  return data.map(mapDatabaseToSupplier);
}

export async function saveSuppliers(
  suppliers: Supplier[]
): Promise<void> {
  const rows = suppliers.map(mapSupplierToDatabase);

  const { error } = await supabase
    .from(TABLE)
    .upsert(rows);

  if (error) {
    console.error("Error saving suppliers:", error);
  }
}

export async function addSupplier(
  supplier: Supplier
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .insert(mapSupplierToDatabase(supplier));

  if (error) {
    console.error("Error adding supplier:", error);
  }
}

export async function updateSupplier(
  supplier: Supplier
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .update(mapSupplierToDatabase(supplier))
    .eq("id", supplier.id);

  if (error) {
    console.error("Error updating supplier:", error);
  }
}

export async function deleteSupplier(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting supplier:", error);
  }
}

export type { Supplier };