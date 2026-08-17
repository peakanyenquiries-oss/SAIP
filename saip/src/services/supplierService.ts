import { supabase } from "@/lib/supabase/client";
import { Supplier } from "@/types/supplier";

function mapSupplier(row: any): Supplier {
  return {
    id: row.id ?? "",

    company: row.company ?? "",
    contactPerson: row.contact_person ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    province: row.province ?? "",
    paymentTerms: row.payment_terms ?? "",

    supplierScore: Number(row.supplier_score ?? 0),

    status:
      row.status === "Inactive"
        ? "Inactive"
        : row.status === "Pending"
        ? "Pending"
        : "Active",

    createdAt: row.created_at ?? "",
    updatedAt: row.updated_at ?? "",
  };
}

export async function getSuppliers(): Promise<Supplier[]> {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Failed to load suppliers:", error);
    throw error;
  }

  return (data ?? []).map(mapSupplier);
}

export async function createSupplier(
  supplier: Supplier
): Promise<Supplier> {
  const { data, error } = await supabase
    .from("suppliers")
    .insert({
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
    })
    .select("*")
    .single();

  if (error) {
    console.error("Failed to create supplier:", error);
    throw error;
  }

  return mapSupplier(data);
}

export async function updateSupplier(
  supplier: Supplier
): Promise<Supplier> {
  const { data, error } = await supabase
    .from("suppliers")
    .update({
      company: supplier.company,
      contact_person: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      province: supplier.province,
      payment_terms: supplier.paymentTerms,
      supplier_score: supplier.supplierScore,
      status: supplier.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", supplier.id)
    .select("*")
    .single();

  if (error) {
    console.error("Failed to update supplier:", error);
    throw error;
  }

  return mapSupplier(data);
}

export async function deleteSupplier(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("suppliers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete supplier:", error);
    throw error;
  }
}

export async function getSupplierById(
  id: string
): Promise<Supplier | null> {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load supplier:", error);
    throw error;
  }

  return data ? mapSupplier(data) : null;
}