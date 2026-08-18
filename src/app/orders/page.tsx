"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Plus, RefreshCw, Search, ShoppingCart, Trash2, XCircle } from "lucide-react";

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

type Product = {
  id: string;
  sku: string | null;
  product_name: string;
  brand: string | null;
  selling_price: number | string | null;
  stock: number | null;
};

type CartItem = Product & { quantity: number };
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
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [notes, setNotes] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");

    const [ordersResult, customersResult, productsResult] = await Promise.all([
      supabase
        .from("sales_orders")
        .select("id, order_number, customer_id, status, payment_status, order_date, subtotal, vat, total, notes, created_by")
        .order("order_date", { ascending: false }),
      supabase
        .from("customers")
        .select("id, first_name, last_name, company")
        .order("company"),
      supabase
        .from("products")
        .select("id, sku, product_name, brand, selling_price, stock")
        .order("product_name")
        .limit(500),
    ]);

    if (ordersResult.error || customersResult.error || productsResult.error) {
      setError(
        ordersResult.error?.message ||
          customersResult.error?.message ||
          productsResult.error?.message ||
          "Unable to load sales order data."
      );
    } else {
      setOrders((ordersResult.data ?? []) as SalesOrder[]);
      setCustomers((customersResult.data ?? []) as Customer[]);
      setProducts((productsResult.data ?? []) as Product[]);
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
      [order.order_number, order.customerName, order.status, order.payment_status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    );
  }, [rows, search]);

  const filteredProducts = useMemo(() => {
    const keyword = productSearch.trim().toLowerCase();
    return products
      .filter((product) =>
        !keyword ||
        [product.sku, product.product_name, product.brand]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(keyword))
      )
      .slice(0, 30);
  }, [products, productSearch]);

  const stats = useMemo(() => {
    const open = orders.filter((order) => !["Completed", "Cancelled"].includes(order.status ?? ""));
    const completed = orders.filter((order) => order.status === "Completed");
    const cancelled = orders.filter((order) => order.status === "Cancelled");
    const revenue = completed.reduce((sum, order) => sum + Number(order.total ?? 0), 0);
    return { open: open.length, completed: completed.length, cancelled: cancelled.length, revenue };
  }, [orders]);

  const subtotal = cart.reduce((sum, item) => sum + Number(item.selling_price ?? 0) * item.quantity, 0);
  const vat = Number((subtotal * 0.15).toFixed(2));
  const total = subtotal + vat;

  function addProduct(product: Product) {
    if (Number(product.stock ?? 0) <= 0) {
      setError(`${product.product_name} is out of stock.`);
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= Number(product.stock ?? 0)) return current;
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    const product = cart.find((item) => item.id === productId);
    if (!product) return;
    const next = Math.max(1, Math.min(quantity, Number(product.stock ?? 0)));
    setCart((current) => current.map((item) => item.id === productId ? { ...item, quantity: next } : item));
  }

  function removeProduct(productId: string) {
    setCart((current) => current.filter((item) => item.id !== productId));
  }

  function resetCreateForm() {
    setCart([]);
    setSelectedCustomer("");
    setNotes("");
    setProductSearch("");
    setError("");
  }

  async function createOrder() {
    setError("");
    setSuccess("");

    if (cart.length === 0) {
      setError("Add at least one product before creating the order.");
      return;
    }

    setSaving(true);
    const { data, error: rpcError } = await supabase.rpc("saip_create_sales_order", {
      p_customer_id: selectedCustomer || null,
      p_items: cart.map((item) => ({ product_id: item.id, quantity: item.quantity })),
      p_notes: notes || null,
      p_created_by: "Administrator",
    });

    if (rpcError) {
      setError(rpcError.message);
    } else {
      setSuccess(`Sales order ${data ? "created successfully" : "created"}.`);
      setShowCreate(false);
      resetCreateForm();
      await loadOrders();
    }

    setSaving(false);
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Orders" subtitle="Sales Order Management" />

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="Open Orders" value={stats.open} subtitle="Awaiting completion" icon={<ShoppingCart size={28} />} />
        <StatCard title="Completed" value={stats.completed} subtitle="Fulfilled sales orders" icon={<CheckCircle2 size={28} />} />
        <StatCard title="Cancelled" value={stats.cancelled} subtitle="Cancelled orders" icon={<XCircle size={28} />} />
        <StatCard title="Sales Revenue" value={money(stats.revenue)} subtitle="Completed order value" icon={<Clock3 size={28} />} />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">{success}</div>
      )}

      <SectionCard title="Sales Orders" subtitle="Live sales orders from the SAIP database.">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[260px] flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order number, customer or status..." className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-500" />
          </div>
          <button type="button" onClick={loadOrders} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-medium hover:bg-slate-50">
            <RefreshCw size={17} /> Refresh
          </button>
          <button type="button" onClick={() => { resetCreateForm(); setShowCreate(true); }} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
            <Plus size={18} /> New Sales Order
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Total</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Loading sales orders...</td></tr> : filteredRows.length === 0 ? <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No sales orders found.</td></tr> : filteredRows.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-900">{order.order_number}</td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3">{new Date(order.order_date).toLocaleDateString("en-ZA")}</td>
                  <td className="px-4 py-3">{order.status || "—"}</td>
                  <td className="px-4 py-3">{order.payment_status || "—"}</td>
                  <td className="px-4 py-3 font-medium">{money(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div><h2 className="text-2xl font-bold text-slate-900">New Sales Order</h2><p className="text-sm text-slate-500">Create a live SAIP sales order.</p></div>
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100">Close</button>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold">Customer</label>
                  <select value={selectedCustomer} onChange={(event) => setSelectedCustomer(event.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500">
                    <option value="">Walk-in / No customer</option>
                    {customers.map((customer) => <option key={customer.id} value={customer.id}>{customerName(customer)}</option>)}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">Find Product</label>
                  <div className="relative mb-3"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder="Search SKU, product or brand..." className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500" /></div>
                  <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-slate-200 p-2">
                    {filteredProducts.map((product) => (
                      <button key={product.id} type="button" onClick={() => addProduct(product)} className="flex w-full items-center justify-between rounded-lg p-3 text-left hover:bg-blue-50">
                        <span><span className="block font-semibold">{product.product_name}</span><span className="text-xs text-slate-500">{product.sku || "No SKU"} · {product.brand || "No brand"} · Stock {product.stock ?? 0}</span></span>
                        <span className="font-semibold text-blue-700">{money(product.selling_price)}</span>
                      </button>
                    ))}
                    {filteredProducts.length === 0 && <p className="p-5 text-center text-sm text-slate-500">No products found.</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">Order Notes</label>
                  <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Optional notes..." className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" />
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <h3 className="mb-4 text-lg font-bold">Order Summary</h3>
                <div className="space-y-3">
                  {cart.length === 0 ? <p className="py-10 text-center text-sm text-slate-500">Add products to build the order.</p> : cart.map((item) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-3">
                      <div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{item.product_name}</p><p className="text-xs text-slate-500">{money(item.selling_price)} each</p></div><button type="button" onClick={() => removeProduct(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button></div>
                      <div className="mt-3 flex items-center justify-between"><input type="number" min={1} max={Number(item.stock ?? 0)} value={item.quantity} onChange={(event) => updateQuantity(item.id, Number(event.target.value))} className="w-24 rounded-lg border border-slate-200 px-3 py-2" /><span className="font-semibold">{money(Number(item.selling_price ?? 0) * item.quantity)}</span></div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
                  <div className="flex justify-between"><span>VAT (15%)</span><span>{money(vat)}</span></div>
                  <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{money(total)}</span></div>
                </div>

                <button type="button" disabled={saving || cart.length === 0} onClick={createOrder} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {saving ? "Creating Order..." : "Create Draft Sales Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
