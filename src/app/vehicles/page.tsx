"use client";

import { useEffect, useMemo, useState } from "react";
import { Car, Database, Factory, Search } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";
import StatCard from "@/components/ui/StatCard";
import { supabase } from "@/lib/supabase/client";

type Make = { id: string; make_name: string };
type Model = { id: string; make_id: string; model_name: string; generation: string | null };
type Variant = {
  id: string;
  model_id: string;
  model_type: string;
  engine_code: string | null;
  engine_cc: number | null;
  power_kw: number | null;
  year_from_month: string | null;
  year_to_month: string | null;
};

type VehicleRow = Variant & {
  make: string;
  model: string;
  generation: string | null;
};

export default function VehiclesPage() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadVehicles() {
    setLoading(true);
    setError("");

    const [makeResult, modelResult, variantResult] = await Promise.all([
      supabase.from("saip_vehicle_makes").select("id, make_name").order("make_name"),
      supabase.from("saip_vehicle_models").select("id, make_id, model_name, generation").order("model_name"),
      supabase
        .from("saip_vehicle_variants")
        .select("id, model_id, model_type, engine_code, engine_cc, power_kw, year_from_month, year_to_month")
        .order("model_type"),
    ]);

    if (makeResult.error || modelResult.error || variantResult.error) {
      setError(
        makeResult.error?.message ||
          modelResult.error?.message ||
          variantResult.error?.message ||
          "Unable to load vehicle master data."
      );
    } else {
      setMakes((makeResult.data ?? []) as Make[]);
      setModels((modelResult.data ?? []) as Model[]);
      setVariants((variantResult.data ?? []) as Variant[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  const rows = useMemo<VehicleRow[]>(() => {
    const modelMap = new Map(models.map((model) => [model.id, model]));
    const makeMap = new Map(makes.map((make) => [make.id, make]));

    return variants.map((variant) => {
      const model = modelMap.get(variant.model_id);
      const make = model ? makeMap.get(model.make_id) : undefined;

      return {
        ...variant,
        make: make?.make_name ?? "Unknown",
        model: model?.model_name ?? "Unknown",
        generation: model?.generation ?? null,
      };
    });
  }, [makes, models, variants]);

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return rows;

    return rows.filter((row) =>
      [
        row.make,
        row.model,
        row.generation,
        row.model_type,
        row.engine_code,
        row.year_from_month,
        row.year_to_month,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    );
  }, [rows, search]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Vehicles"
        subtitle="Vehicle Master & Fitment Intelligence"
      />

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Makes"
          value={makes.length}
          subtitle="Vehicle manufacturers"
          icon={<Factory size={28} />}
        />
        <StatCard
          title="Models"
          value={models.length}
          subtitle="Master models"
          icon={<Car size={28} />}
        />
        <StatCard
          title="Variants"
          value={variants.length}
          subtitle="Engine/model variants"
          icon={<Database size={28} />}
        />
      </div>

      <SectionCard
        title="Vehicle Master Database"
        subtitle="Search the live SAIP vehicle master data."
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search make, model, engine or year..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={loadVehicles}
            className="rounded-xl border border-slate-200 px-5 py-3 font-medium hover:bg-slate-50"
          >
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
                <th className="px-4 py-3">Make</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Generation</th>
                <th className="px-4 py-3">Variant</th>
                <th className="px-4 py-3">Engine</th>
                <th className="px-4 py-3">Power</th>
                <th className="px-4 py-3">Years</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    Loading vehicle master data...
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    No vehicle records found.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.make}</td>
                    <td className="px-4 py-3">{row.model}</td>
                    <td className="px-4 py-3">{row.generation || "—"}</td>
                    <td className="px-4 py-3">{row.model_type}</td>
                    <td className="px-4 py-3">
                      {row.engine_code || "—"}
                      {row.engine_cc ? ` · ${row.engine_cc.toLocaleString()} cc` : ""}
                    </td>
                    <td className="px-4 py-3">{row.power_kw ? `${row.power_kw} kW` : "—"}</td>
                    <td className="px-4 py-3">
                      {row.year_from_month || "—"} → {row.year_to_month || "Current"}
                    </td>
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
