"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText, RefreshCw, UserRound, Car, Wrench, CheckCircle2, AlertTriangle } from "lucide-react";
import EnterpriseLayout from "@/components/layout/EnterpriseLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getCustomers } from "@/services/customerService";
import { getVehicleVariants, VehicleVariant } from "@/lib/vehicle-fitment-service";
import { getServiceKits, ServiceKitSummary } from "@/lib/service-kit-service";
import { getVehicleServiceKitRecommendation, VehicleServiceKitRecommendation } from "@/lib/vehicle-service-kit-service";
import { createServiceQuote } from "@/lib/service-quote-service";

type Customer = { id: string; firstName: string; lastName: string; company?: string; status: string };

export default function QuotationsPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<VehicleVariant[]>([]);
  const [kits, setKits] = useState<ServiceKitSummary[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [kitId, setKitId] = useState("");
  const [recommendation, setRecommendation] = useState<VehicleServiceKitRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    setLoading(true); setError("");
    try {
      const [customerRows, vehicleRows, kitRows] = await Promise.all([getCustomers(), getVehicleVariants(), getServiceKits()]);
      setCustomers(customerRows as Customer[]); setVehicles(vehicleRows); setKits(kitRows);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load quotation data."); }
    finally { setLoading(false); }
  }

  async function buildRecommendation(nextKitId = kitId) {
    setKitId(nextKitId); setRecommendation(null); setSuccess("");
    if (!vehicleId || !nextKitId) return;
    setRecommendLoading(true); setError("");
    try { setRecommendation(await getVehicleServiceKitRecommendation(vehicleId, nextKitId)); }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to generate recommendation."); }
    finally { setRecommendLoading(false); }
  }

  async function saveQuote() {
    if (!customerId || !vehicleId || !kitId || !recommendation) { setError("Select a customer, vehicle and service kit before saving the quote."); return; }
    setSaving(true); setError(""); setSuccess("");
    try {
      const quote = await createServiceQuote({
        customerId, vehicleVariantId: vehicleId, serviceKitId: kitId,
        items: recommendation.items.map((item) => ({ productId: item.productId, description: item.productName, quantity: item.quantity, unitPrice: item.sellingPrice, unitCost: item.costPrice, required: item.required })),
      });
      setSuccess(`Quote ${quote.quote_number} saved as DRAFT.`);
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save quotation."); }
    finally { setSaving(false); }
  }

  useEffect(() => { load(); }, []);

  const selectedVehicle = useMemo(() => vehicles.find((v) => v.id === vehicleId), [vehicles, vehicleId]);
  const activeCustomers = customers.filter((c) => c.status === "Active");

  return (
    <EnterpriseLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700"><FileText size={17}/> Sales & Service Commercials</div><h1 className="text-4xl font-bold tracking-tight text-slate-900">Service Quotations</h1><p className="mt-2 max-w-2xl text-slate-500">Build a commercial service quotation directly from SAIP's live vehicle, fitment, service-kit and product intelligence.</p></div>
          <Button type="button" variant="ghost" onClick={load} disabled={loading} className="gap-2"><RefreshCw size={17} className={loading ? "animate-spin" : ""}/>Refresh</Button>
        </div>

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        {success && <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800"><CheckCircle2 size={19}/>{success}</div>}

        <div className="grid gap-6 lg:grid-cols-3">
          <Card><div className="mb-3 flex items-center gap-2 font-semibold"><UserRound size={18} className="text-blue-600"/>Customer</div><select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3"><option value="">Select active customer</option>{activeCustomers.map((c) => <option key={c.id} value={c.id}>{`${c.firstName} ${c.lastName}`.trim()} {c.company ? `· ${c.company}` : ""}</option>)}</select></Card>
          <Card><div className="mb-3 flex items-center gap-2 font-semibold"><Car size={18} className="text-blue-600"/>Vehicle</div><select value={vehicleId} onChange={(e) => { setVehicleId(e.target.value); setKitId(""); setRecommendation(null); }} className="w-full rounded-xl border border-slate-200 bg-white p-3"><option value="">Select vehicle variant</option>{vehicles.map((v) => <option key={v.id} value={v.id}>{v.make} {v.model} {v.variant} {v.engineCode ? `· ${v.engineCode}` : ""}</option>)}</select></Card>
          <Card><div className="mb-3 flex items-center gap-2 font-semibold"><Wrench size={18} className="text-blue-600"/>Service Kit</div><select value={kitId} onChange={(e) => buildRecommendation(e.target.value)} disabled={!vehicleId} className="w-full rounded-xl border border-slate-200 bg-white p-3"><option value="">{vehicleId ? "Select service kit" : "Select vehicle first"}</option>{kits.map((k) => <option key={k.id} value={k.id}>{k.name} · {k.serviceType}</option>)}</select></Card>
        </div>

        {selectedVehicle && <Card><div className="flex flex-wrap items-center gap-3 text-sm text-slate-600"><span className="font-semibold text-slate-900">Vehicle:</span>{selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.generation || ""} {selectedVehicle.variant} · {selectedVehicle.engineCode || "Engine not specified"}{selectedVehicle.engineCc ? ` · ${selectedVehicle.engineCc.toLocaleString()} cc` : ""}</div></Card>}

        {recommendLoading && <Card><div className="py-10 text-center text-slate-500">Building live fitment and service-kit recommendation...</div></Card>}

        {recommendation && !recommendLoading && <Card>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-xl font-bold text-slate-900">{recommendation.serviceKitName}</h2><p className="text-sm text-slate-500">Live recommendation for {recommendation.vehicleLabel}</p></div><Button type="button" onClick={saveQuote} disabled={saving} className="gap-2">{saving ? "Saving..." : "Save Draft Quote"}</Button></div>
          <div className="grid gap-4 md:grid-cols-4 mb-6">{[["Subtotal", recommendation.totalSellingPrice], ["Cost", recommendation.totalCost], ["Gross Profit", recommendation.grossProfit], ["Margin", recommendation.grossMarginPercent, true]].map(([label, value, percent]) => <div key={String(label)} className="rounded-2xl border border-slate-200 p-4"><div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div><div className="mt-1 text-2xl font-bold text-slate-900">{percent ? `${Number(value).toFixed(1)}%` : `R ${Number(value).toFixed(2)}`}</div></div>)}</div>
          <div className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 ${recommendation.readyForService ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>{recommendation.readyForService ? <CheckCircle2 size={20}/> : <AlertTriangle size={20}/>}<div><div className="font-semibold">{recommendation.readyForService ? "Ready for service" : "Review before quoting"}</div><div className="text-sm opacity-80">{recommendation.readyForService ? "Required fitment and stock checks passed." : "One or more required items needs fitment or stock attention."}</div></div></div>
          <div className="overflow-x-auto rounded-2xl border border-slate-200"><table className="min-w-full text-sm"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Qty</th><th className="px-4 py-3">Fitment</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Unit Price</th><th className="px-4 py-3">Line Total</th></tr></thead><tbody className="divide-y divide-slate-100">{recommendation.items.map((item) => <tr key={item.serviceKitItemId}><td className="px-4 py-3 font-medium">{item.productName}{item.sku ? ` · ${item.sku}` : ""}</td><td className="px-4 py-3">{item.quantity}</td><td className="px-4 py-3">{item.fitmentConfirmed ? item.fitmentType : "Not confirmed"}</td><td className="px-4 py-3">{item.stock}</td><td className="px-4 py-3">R {item.sellingPrice.toFixed(2)}</td><td className="px-4 py-3">R {(item.sellingPrice * item.quantity).toFixed(2)}</td></tr>)}</tbody></table></div>
        </Card>}

        {!loading && !recommendation && <Card><div className="py-12 text-center text-slate-500">Select a customer, vehicle and service kit to build a quotation from live SAIP intelligence.</div></Card>}
      </div>
    </EnterpriseLayout>
  );
}
