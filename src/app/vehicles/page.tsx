"use client";

import { useEffect, useMemo, useState } from "react";
import { Car, Database, Factory, Search, PackageCheck, Wrench, CheckCircle2, AlertTriangle } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import StatCard from "@/components/ui/StatCard";
import { getCompatibleProducts, getVehicleVariants, VehicleVariant, CompatibleProduct } from "@/lib/vehicle-fitment-service";
import { getServiceKits, ServiceKitSummary } from "@/lib/service-kit-service";
import { getVehicleServiceKitRecommendation, VehicleServiceKitRecommendation } from "@/lib/vehicle-service-kit-service";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<VehicleVariant[]>([]);
  const [serviceKits, setServiceKits] = useState<ServiceKitSummary[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [products, setProducts] = useState<CompatibleProduct[]>([]);
  const [recommendation, setRecommendation] = useState<VehicleServiceKitRecommendation | null>(null);
  const [search, setSearch] = useState("");
  const [selectedKitId, setSelectedKitId] = useState("");
  const [loading, setLoading] = useState(true);
  const [fitmentLoading, setFitmentLoading] = useState(false);
  const [kitLoading, setKitLoading] = useState(false);
  const [error, setError] = useState("");
  const [fitmentError, setFitmentError] = useState("");
  const [kitError, setKitError] = useState("");

  async function loadVehicles() {
    setLoading(true);
    setError("");
    try {
      const [vehicleRows, kits] = await Promise.all([getVehicleVariants(), getServiceKits()]);
      setVehicles(vehicleRows);
      setServiceKits(kits);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load vehicle and service-kit data.");
    } finally {
      setLoading(false);
    }
  }

  async function loadFitments(vehicleId: string) {
    setSelectedVehicleId(vehicleId);
    setProducts([]);
    setRecommendation(null);
    setSelectedKitId("");
    setFitmentError("");
    setKitError("");
    if (!vehicleId) return;
    setFitmentLoading(true);
    try {
      setProducts(await getCompatibleProducts(vehicleId));
    } catch (e) {
      setFitmentError(e instanceof Error ? e.message : "Unable to load compatible products.");
    } finally {
      setFitmentLoading(false);
    }
  }

  async function recommendKit(kitId: string) {
    setSelectedKitId(kitId);
    setRecommendation(null);
    setKitError("");
    if (!kitId || !selectedVehicleId) return;
    setKitLoading(true);
    try {
      setRecommendation(await getVehicleServiceKitRecommendation(selectedVehicleId, kitId));
    } catch (e) {
      setKitError(e instanceof Error ? e.message : "Unable to generate the service-kit recommendation.");
    } finally {
      setKitLoading(false);
    }
  }

  useEffect(() => { loadVehicles(); }, []);

  const filteredVehicles = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return vehicles;
    return vehicles.filter((vehicle) => [vehicle.make, vehicle.model, vehicle.generation, vehicle.variant, vehicle.engineCode, vehicle.yearFrom, vehicle.yearTo].filter(Boolean).some((value) => String(value).toLowerCase().includes(keyword)));
  }, [vehicles, search]);

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId);

  return (
    <div className="space-y-8">
      <PageHeader title="Vehicles" subtitle="Vehicle Master & Fitment Intelligence" />

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Makes" value={new Set(vehicles.map((v) => v.make)).size} subtitle="Vehicle manufacturers" icon={<Factory size={28} />} />
        <StatCard title="Models" value={new Set(vehicles.map((v) => `${v.make}|${v.model}`)).size} subtitle="Master models" icon={<Car size={28} />} />
        <StatCard title="Variants" value={vehicles.length} subtitle="Engine/model variants" icon={<Database size={28} />} />
      </div>

      <SectionCard title="Vehicle Master Database" subtitle="Search the live SAIP vehicle master and inspect compatible products and service kits.">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search make, model, engine or year..." className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-500" />
          </div>
          <button onClick={loadVehicles} className="rounded-xl border border-slate-200 px-5 py-3 font-medium hover:bg-slate-50">Refresh</button>
        </div>

        {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-4 py-3">Make</th><th className="px-4 py-3">Model</th><th className="px-4 py-3">Generation</th><th className="px-4 py-3">Variant</th><th className="px-4 py-3">Engine</th><th className="px-4 py-3">Power</th><th className="px-4 py-3">Years</th><th className="px-4 py-3">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-500">Loading vehicle master data...</td></tr> : filteredVehicles.length === 0 ? <tr><td colSpan={8} className="px-4 py-10 text-center text-slate-500">No vehicle records found.</td></tr> : filteredVehicles.map((row) => (
                <tr key={row.id} className={`hover:bg-slate-50 ${selectedVehicleId === row.id ? "bg-blue-50/50" : ""}`}>
                  <td className="px-4 py-3 font-medium text-slate-900">{row.make}</td><td className="px-4 py-3">{row.model}</td><td className="px-4 py-3">{row.generation || "—"}</td><td className="px-4 py-3">{row.variant}</td><td className="px-4 py-3">{row.engineCode || "—"}{row.engineCc ? ` · ${row.engineCc.toLocaleString()} cc` : ""}</td><td className="px-4 py-3">{row.powerKw ? `${row.powerKw} kW` : "—"}</td><td className="px-4 py-3">{row.yearFrom || "—"} → {row.yearTo || "Current"}</td>
                  <td className="px-4 py-3"><button onClick={() => loadFitments(row.id)} className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"><PackageCheck size={15} />Inspect</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {selectedVehicleId && (
        <>
          <SectionCard title="Service Kit Intelligence" subtitle={selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.variant} · ${selectedVehicle.engineCode || "Engine not specified"}` : "Selected vehicle variant"}>
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Service Kit</label>
                <select value={selectedKitId} onChange={(event) => recommendKit(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-blue-500">
                  <option value="">Select a service kit</option>
                  {serviceKits.map((kit) => <option key={kit.id} value={kit.id}>{kit.name} · {kit.serviceType}</option>)}
                </select>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-600"><Wrench className="mr-2 inline-block" size={17} />{serviceKits.length} active kit{serviceKits.length === 1 ? "" : "s"}</div>
            </div>

            {kitError && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{kitError}</div>}
            {kitLoading && <div className="py-8 text-center text-slate-500">Generating live service-kit recommendation...</div>}

            {recommendation && !kitLoading && (
              <div className="mt-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <Metric label="Kit Cost" value={`R ${recommendation.totalCost.toFixed(2)}`} />
                  <Metric label="Customer Price" value={`R ${recommendation.totalSellingPrice.toFixed(2)}`} />
                  <Metric label="Gross Profit" value={`R ${recommendation.grossProfit.toFixed(2)}`} />
                  <Metric label="Gross Margin" value={`${recommendation.grossMarginPercent.toFixed(1)}%`} />
                </div>

                <div className={`flex items-center gap-3 rounded-xl border p-4 ${recommendation.readyForService ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
                  {recommendation.readyForService ? <CheckCircle2 size={21} /> : <AlertTriangle size={21} />}
                  <div><div className="font-semibold">{recommendation.readyForService ? "Ready for service" : "Service kit needs attention"}</div><div className="text-sm opacity-80">{recommendation.readyForService ? "All required items have confirmed fitment and sufficient stock." : "One or more required items are missing fitment confirmation or stock."}</div></div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-full text-sm"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Qty</th><th className="px-4 py-3">Fitment</th><th className="px-4 py-3">Supplier</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Cost</th><th className="px-4 py-3">Selling</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100 bg-white">{recommendation.items.map((item) => <tr key={item.serviceKitItemId}><td className="px-4 py-3 font-medium">{item.productName}{item.sku ? ` · ${item.sku}` : ""}</td><td className="px-4 py-3">{item.quantity}{item.required ? " · Required" : " · Optional"}</td><td className="px-4 py-3">{item.fitmentConfirmed ? <span className="text-emerald-700">{item.fitmentType}</span> : <span className="text-red-600">Not confirmed</span>}</td><td className="px-4 py-3">{item.supplierName || "Unassigned"}</td><td className="px-4 py-3">{item.stock}</td><td className="px-4 py-3">R {item.costPrice.toFixed(2)}</td><td className="px-4 py-3">R {item.sellingPrice.toFixed(2)}</td><td className="px-4 py-3">{item.fitmentConfirmed && item.stockReady ? <span className="font-semibold text-emerald-700">Ready</span> : <span className="font-semibold text-amber-700">Attention</span>}</td></tr>)}</tbody></table>
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Compatible Products" subtitle="Products currently recorded against this vehicle variant.">
            {fitmentError && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{fitmentError}</div>}
            {fitmentLoading ? <div className="py-10 text-center text-slate-500">Loading compatible products...</div> : products.length === 0 ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">No compatible products are currently recorded for this vehicle variant.</div> : (
              <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="min-w-full text-sm"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Product</th><th className="px-4 py-3">Fitment</th><th className="px-4 py-3">Supplier</th><th className="px-4 py-3">Cost</th><th className="px-4 py-3">Selling</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Verification</th></tr></thead><tbody className="divide-y divide-slate-100 bg-white">{products.map((product) => <tr key={product.fitmentId}><td className="px-4 py-3 font-medium">{product.sku || "—"}</td><td className="px-4 py-3">{product.productName}{product.brand ? ` · ${product.brand}` : ""}</td><td className="px-4 py-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">{product.fitmentType}</span></td><td className="px-4 py-3">{product.supplierName || "Unassigned"}</td><td className="px-4 py-3">R {product.costPrice.toFixed(2)}</td><td className="px-4 py-3">R {product.sellingPrice.toFixed(2)}</td><td className="px-4 py-3">{product.stock} / min {product.minimumStock}</td><td className="px-4 py-3">{product.verifiedAt ? new Date(product.verifiedAt).toLocaleDateString() : "Not verified"}</td></tr>)}</tbody></table></div>
            )}
          </SectionCard>
        </>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div><div className="mt-1 text-xl font-bold text-slate-900">{value}</div></div>;
}
