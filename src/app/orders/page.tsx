"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, RefreshCw, Search, ShoppingCart, XCircle } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import StatCard from "@/components/ui/StatCard";
import { supabase } from "@/lib/supabase/client";

type SalesOrder = {
  id: string;
  order_number: string;
  customer_id: string | null;
  status: string | null;
  payment_status: string | null;
  order_date: string;
  subtotal: number | string | null;
  vat: number | string | null;
  total: number | string | null;
  notes: string | null;
  created_by: string | null;
};

type Customer = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
};

type OrderRow = SalesOrder & { customerName: string };

const money = (value: number | string | null) =>
  `R ${Number(value ?? 0).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const customerName = (customer: Customer | undefined) => {
  if (!customer) return "Walk-in / Unknown";
  const person = [customer.first_name, customer.last_name].filter(Boolean).join(" ");
  return customer.company || person || "Unnamed Customer";
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");

    const [ordersResult, customersResult] = await Promise.all([
      supabase
        .from("sales_orders")
        .select("id, order_number, customer_id, status, payment_status, order_date, subtotal, vat, total, notes, created_by")
        .order("order_date", { ascending: false }),
      supabase
        .from("customers")
        .select("id, first_name, last_name, company")
        .order("company"),
    ]);

    if (ordersResult.error || customersResult.error) {
      setError(
        ordersResult.error?.message ||
          customersResult.error?.message ||
          "Unable to load sales orders."
      );
    } else {
      setOrders((ordersResult.data ?? []) as SalesOrder[]);
      setCustomers((customersResult.data ?? []) as Customer[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const rows = useMemo<OrderRow[]>(() => {
    const customerMap = new Map(customers.map((customer) => [customer.id, customer]));
    return orders.map((order) => ({
      ...order,
      customerName: customerName(order.customer_id ? customerMap.get(order.customer_id) : undefined),
    }));
  }, [orders, customers]);

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return rows;

    return rows.filter((order) =>
      [
        order.order_number,
        order.customerName,
        order.status,
        order.payment_status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    );
  }, [rows, search]);

  const stats = useMemo(() => {
    const open = orders.filter((order) => !["Completed", "Cancelled"].includes(order.status ?? ""));
    const completed = orders.filter((order) => order.status === "Completed");
    const cancelled = orders.filter((order) => order.status === "Cancelled");
    const revenue = completed.reduce((sum, order) => sum + Number(order.total ?? 0), 0);

    return { open: open.length, completed: completed.length, cancelled: cancelled.length, revenue };
  }, [orders]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Orders"
        subtitle="Sales Order Management"
      />

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="Open Orders" value={stats.open} subtitle="Awaiting completion" icon={<ShoppingCart size={28} />} />
        <StatCard title="Completed" value={stats.completed} subtitle="Fulfilled sales orders" icon={<CheckCircle2 size={28} />} />
        <StatCard title="Cancelled" value={stats.cancelled} subtitle="Cancelled orders" icon={<XCircle size={28} />} />
        <StatCard title="Sales Revenue" value={money(stats.revenue)} subtitle="Completed order value" icon={<Clock3 size={28} />} />
      </div>

      <SectionCard title="Sales Orders" subtitle="Live sales orders from the SAIP database.">
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order number, customer or status..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={loadOrders}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-medium hover:bg-slate-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Loading sales orders...</td></tr>
              ) : filteredRows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No sales orders found.</td></tr>
              ) : (
                filteredRows.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{order.order_number}</td>
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3">{new Date(order.order_date).toLocaleDateString("en-ZA")}</td>
                    <td className="px-4 py-3">{order.status || "—"}</td>
                    <td className="px-4 py-3">{order.payment_status || "—"}</td>
                    <td className="px-4 py-3 font-medium">{money(order.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
