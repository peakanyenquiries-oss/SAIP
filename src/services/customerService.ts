import { supabase } from "@/lib/supabase/client";
import { Customer } from "@/types/customer";

function mapCustomer(row: any): Customer {
  return {
    id: row.id,

    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    company: row.company ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    address: row.address ?? "",
    city: row.city ?? "",
    province: row.province ?? "",
    notes: row.notes ?? "",
    status: row.status === "Inactive" ? "Inactive" : "Active",

    createdAt: row.created_at ?? "",
    updatedAt: row.updated_at ?? "",
  };
}

export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Failed to load customers:", error);
    throw error;
  }

  return (data ?? []).map(mapCustomer);
}

export async function createCustomer(
  customer: Customer
): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .insert({
      id: customer.id,
      first_name: customer.firstName,
      last_name: customer.lastName,
      company: customer.company,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      province: customer.province,
      notes: customer.notes,
      status: customer.status,
      created_at: customer.createdAt,
      updated_at: customer.updatedAt,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Failed to create customer:", error);
    throw error;
  }

  return mapCustomer(data);
}

export async function updateCustomer(
  customer: Customer
): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .update({
      first_name: customer.firstName,
      last_name: customer.lastName,
      company: customer.company,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      province: customer.province,
      notes: customer.notes,
      status: customer.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", customer.id)
    .select("*")
    .single();

  if (error) {
    console.error("Failed to update customer:", error);
    throw error;
  }

  return mapCustomer(data);
}

export async function deleteCustomer(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete customer:", error);
    throw error;
  }
}

export async function getCustomerById(
  id: string
): Promise<Customer | null> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load customer:", error);
    throw error;
  }

  return data ? mapCustomer(data) : null;
}