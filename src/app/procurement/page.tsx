"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, RefreshCw, ShoppingCart, TrendingDown, XCircle } from "lucide-react";

import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import SectionCard from "@/components/ui/SectionCard";
import useProcurementIntelligence from "@/hooks/useProcurementIntelligence";

const money = (value: number | null) =>
  value == null
    ? "—"
    : `R ${value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function statusClass(status: string) {
  switch (status) {
    case "Recommended":
      return "bg-blue-100 text-blue-700";
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Converted":
      return "bg-purple-100 text-purple-700";
    case "Draft":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

export default function ProcurementPage() {
  const {
    recommendations,
    requests,
    loading,
    error,
    createRequest,
    approveRequest,
    convertToPurchaseOrder,
    refresh,
  } = useProcurementIntelligence();

  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filteredRecommendations = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return recommendations;
    return recommendations.filter((item) =>
      [item.product_name, item.sku, item.supplier_name ?? "", item.recommendation, item.rationale]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [recommendations, search]);

  const openRecommendations = recommendations.filter((item) => item.recommendation === "ORDER_NOW");
  const approvalQueue = requests.filter((request) => request.status === "Recommended");
  const readyForPo = requests.filter((request) => request.status === "Approved" && !request.purchase_order_id);

  async function handleCreateRequest(productId: string, quantity: number) {
    setBusyId(productId);
    try {
      await createRequest(productId, quantity);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unable to create procurement request.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleApprove(requestId: string) {
    setBusyId(requestId);
    try {
      await approveRequest(requestId);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unable to approve procurement request.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleConvert(requestId: string) {
    setBusyId(requestId);
    try {
      await convertToPurchaseOrder(requestId);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unable to convert request to purchase order.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Procurement Intelligence"
        subtitle="Demand signals, supplier recommendations and controlled purchasing execution"
        actions={
          <Button variant="ghost" onClick={refresh}>
            <RefreshCw size={17} />
            Refresh Intelligence
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Order Now" value={openRecommendations.length} icon={<TrendingDown size={20} />} />
        <MetricCard label="Approval Queue" value={approvalQueue.length} icon={<CheckCircle2 size={20} />} />
        <MetricCard label="Ready for PO" value={readyForPo.length} icon={<ShoppingCart size={20} />} />
      </div>

      <SectionCard
        title="Replenishment Recommendations"
        subtitle="Recommendations generated from stock, demand, supplier quotes, MOQ, lead time and supplier intelligence."
      >
        <div className="mb-5">
          <SearchBar value={search} onChange={setSearch} placeholder="Search product, SKU, supplier or recommendation..." />
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">Loading procurement intelligence…</div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>
        ) : filteredRecommendations.length === 0 ? (
          <EmptyState title="No replenishment recommendations" detail="SAIP currently has no live supplier-backed replenishment signals." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-[1100px] w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Cover</th>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">Supplier Score</th>
                  <th className="px-4 py-3">Landed Cost</th>
                  <th className="px-4 py-3">Order Qty</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Decision</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRecommendations.map((item) => (
                  <tr key={`${item.inventory_id}-${item.product_id}`} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{item.product_name}</div>
                      <div className="text-xs text-slate-500">{item.sku}</div>
                    </td>
                    <td className="px-4 py-4">{item.available_quantity}</td>
                    <td className="px-4 py-4">{item.days_of_cover == null ? "—" : `${item.days_of_cover} days`}</td>
                    <td className="px-4 py-4">{item.supplier_name ?? "No supplier"}</td>
                    <td className="px-4 py-4">{item.supplier_score.toFixed(0)}/100</td>
                    <td className="px-4 py-4">{money(item.landed_unit_cost)}</td>
                    <td className="px-4 py-4 font-semibold">{item.recommended_order_quantity}</td>
                    <td className="px-4 py-4">{money(item.recommended_order_value)}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.recommendation === "ORDER_NOW" ? "bg-red-100 text-red-700" : item.recommendation === "EXPEDITE_REVIEW" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`}>
                        {item.recommendation.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {item.supplier_id && item.recommendation !== "MONITOR" ? (
                        <Button
                          variant="ghost"
                          disabled={busyId === item.product_id}
                          onClick={() => handleCreateRequest(item.product_id, item.recommended_order_quantity)}
                        >
                          <ShoppingCart size={16} />
                          Create Request
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400">Monitor</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Procurement Execution Queue"
        subtitle="Requests move through recommendation, approval and purchase-order creation."
      >
        {requests.length === 0 ? (
          <EmptyState title="No procurement requests" detail="Create a request from a live replenishment recommendation to begin the controlled purchasing workflow." />
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div key={request.id} className="grid gap-4 rounded-xl border border-slate-200 p-5 lg:grid-cols-[2fr_1fr_1fr_1fr_auto] lg:items-center">
                <div>
                  <div className="font-semibold text-slate-900">{request.product_name}</div>
                  <div className="text-xs text-slate-500">{request.sku} · Request {request.id.slice(0, 8)}</div>
                </div>
                <div><div className="text-xs text-slate-500">Quantity</div><div className="font-semibold">{request.requested_quantity}</div></div>
                <div><div className="text-xs text-slate-500">Supplier</div><div className="font-semibold">{request.supplier_name ?? "Not selected"}</div></div>
                <div><div className="text-xs text-slate-500">Status</div><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(request.status)}`}>{request.status}</span></div>
                <div className="flex gap-2 justify-end">
                  {request.status === "Recommended" && (
                    <Button variant="ghost" disabled={busyId === request.id} onClick={() => handleApprove(request.id)}><CheckCircle2 size={16} />Approve</Button>
                  )}
                  {request.status === "Approved" && !request.purchase_order_id && (
                    <Button disabled={busyId === request.id} onClick={() => handleConvert(request.id)}><ShoppingCart size={16} />Create PO</Button>
                  )}
                  {request.purchase_order_id && <span className="text-xs text-purple-700">PO linked</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-3 flex items-center justify-between text-slate-500"><span className="text-sm font-medium">{label}</span>{icon}</div><div className="text-3xl font-bold tracking-tight text-slate-950">{value}</div></div>;
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center"><XCircle className="mx-auto mb-3 text-slate-400" size={28} /><div className="font-semibold text-slate-800">{title}</div><div className="mt-1 text-sm text-slate-500">{detail}</div></div>;
}
