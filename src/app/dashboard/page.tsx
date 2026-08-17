"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Truck,
  Car,
  Users,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import SectionCard from "@/components/ui/SectionCard";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { supabase } from "@/lib/supabase/client";

type Metrics = {
  suppliers: number;
  products: number;
  variants: number;
  fitments: number;
  customers: number;
  openOrders: number;
  revenue: number;
};

const emptyMetrics: Metrics = {
  suppliers: 0,
  products: 0,
  variants: 0,
  fitments: 0,
  customers: 0,
  openOrders: 0,
  revenue: 0,
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics>(emptyMetrics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMetrics() {
      setLoading(true);
      setError("");

      const monthStart = new Date();
      monthStart.setDate(1);
      const monthStartIso = monthStart.toISOString().slice(0, 10);

      const [suppliers, products, variants, fitments, customers, orders, sales] =
        await Promise.all([
          supabase.from("suppliers").select("id", { count: "exact", head: true }),
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase.from("saip_vehicle_variants").select("id", { count: "exact", head: true }),
          supabase.from("saip_product_fitments").select("id", { count: "exact", head: true }),
          supabase.from("customers").select("id", { count: "exact", head: true }),
          supabase.from("sales_orders").select("id", { count: "exact", head: true }).not("status", "in", "(Completed,Cancelled)"),
          supabase.from("sales_orders").select("total").gte("order_date", monthStartIso),
        ]);

      const firstError =
        suppliers.error ||
        products.error ||
        variants.error ||
        fitments.error ||
        customers.error ||
        orders.error ||
        sales.error;

      if (firstError) {
        setError(firstError.message);
      }

      const revenue = (sales.data ?? []).reduce(
        (sum, order) => sum + Number(order.total ?? 0),
        0
      );

      setMetrics({
        suppliers: suppliers.count ?? 0,
        products: products.count ?? 0,
        variants: variants.count ?? 0,
        fitments: fitments.count ?? 0,
        customers: customers.count ?? 0,
        openOrders: orders.count ?? 0,
        revenue,
      });

      setLoading(false);
    }

    loadMetrics();
  }, []);

  const display = (value: number) => (loading ? "—" : value.toLocaleString());

  return (
    <div className="space-y-8">
      <PageHeader
        title="Enterprise Dashboard"
        subtitle="South African Automotive Intelligence Platform"
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Some dashboard metrics could not be loaded: {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Suppliers" value={display(metrics.suppliers)} subtitle="Registered Suppliers" icon={<Truck size={28} />} />
        <StatCard title="Products" value={display(metrics.products)} subtitle="Catalogue Items" icon={<Package size={28} />} />
        <StatCard title="Vehicle Variants" value={display(metrics.variants)} subtitle={`${display(metrics.fitments)} product fitments`} icon={<Car size={28} />} />
        <StatCard title="Customers" value={display(metrics.customers)} subtitle="Registered Customers" icon={<Users size={28} />} />
        <StatCard title="Orders" value={display(metrics.openOrders)} subtitle="Open Sales Orders" icon={<ShoppingCart size={28} />} />
        <StatCard title="Revenue" value={loading ? "—" : `R${metrics.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} subtitle="Sales this month" icon={<TrendingUp size={28} />} color="text-green-600" />
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionCard title="Enterprise Overview" subtitle="Live SAIP Core Status">
            <div className="space-y-4">
              <div className="rounded-xl border bg-green-50 p-4">
                <h3 className="font-semibold text-green-700">Enterprise Core Online</h3>
                <p className="mt-1 text-sm text-green-600">
                  Dashboard metrics are now sourced from the live Supabase database instead of hardcoded demo values.
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold">Testing Mode</h3>
                <p className="mt-2 text-slate-600">
                  We are validating each SAIP module against the live application and database before adding new functionality.
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
        <NotificationCenter />
      </div>
    </div>
  );
}
