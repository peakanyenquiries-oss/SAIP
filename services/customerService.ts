import { supabase } from "@/lib/supabase/client";

export async function getCustomers() {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
}

export async function createCustomer(customer: any) {
  const { data, error } = await supabase
    .from("customers")
    .insert(customer)
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCustomer(
  id: string,
  customer: any
) {
  const { data, error } = await supabase
    .from("customers")
    .update(customer)
    .eq("id", id)
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteCustomer(id: string) {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}