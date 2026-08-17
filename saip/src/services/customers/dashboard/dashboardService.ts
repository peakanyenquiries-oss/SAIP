import { supabase } from "@/lib/supabase/client";

export async function getDashboardStats() {
  const [
    customers,
    suppliers,
    products,
    vehicles,
  ] = await Promise.all([
    supabase
      .from("customers")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("suppliers")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("products")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("vehicles")
      .select("*", { count: "exact", head: true }),
  ]);

  return {
    customers: customers.count ?? 0,
    suppliers: suppliers.count ?? 0,
    products: products.count ?? 0,
    vehicles: vehicles.count ?? 0,
  };
}