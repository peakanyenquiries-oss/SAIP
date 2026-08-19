"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Product } from "@/types/product";

interface Props {
  product?: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const emptyProduct: Product = {
  id: "",
  sku: "",
  name: "",
  brand: "",
  category: "",
  supplierId: "",
  costPrice: 0,
  sellingPrice: 0,
  quantity: 0,
  minimumStock: 0,
  barcode: "",
  status: "Active",
  createdAt: "",
  updatedAt: "",
};

export default function ProductForm({ product, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Product>(emptyProduct);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setForm(product);
    } else {
      const now = new Date().toISOString();
      setForm({ ...emptyProduct, id: crypto.randomUUID(), createdAt: now, updatedAt: now });
    }
    setError(null);
  }, [product]);

  const margin = useMemo(() => form.sellingPrice - form.costPrice, [form.sellingPrice, form.costPrice]);
  const marginPercent = useMemo(() => {
    if (form.sellingPrice <= 0) return 0;
    return (margin / form.sellingPrice) * 100;
  }, [form.sellingPrice, margin]);

  function updateField<K extends keyof Product>(field: K, value: Product[K]) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setError(null);
  }

  function submit() {
    const sku = form.sku.trim();
    const name = form.name.trim();
    const cost = Number(form.costPrice);
    const selling = Number(form.sellingPrice);
    const quantity = Number(form.quantity);
    const minimumStock = Number(form.minimumStock);

    if (!sku || !name) {
      setError("SKU and Product Name are required.");
      return;
    }
    if (cost < 0 || selling < 0 || quantity < 0 || minimumStock < 0) {
      setError("Cost, selling price, quantity and minimum stock cannot be negative.");
      return;
    }
    if (selling > 0 && cost > selling) {
      setError("Selling price cannot be lower than cost price for a standard catalogue item.");
      return;
    }
    if (form.status === "Active" && selling <= 0) {
      setError("An Active product must have a selling price before it can be sold.");
      return;
    }

    onSave({
      ...form,
      sku,
      name,
      brand: form.brand.trim(),
      category: form.category.trim(),
      barcode: form.barcode.trim(),
      costPrice: cost,
      sellingPrice: selling,
      quantity,
      minimumStock,
      updatedAt: new Date().toISOString(),
    });
  }

  return (
    <Card className="w-full max-w-5xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">{product ? "Edit Product" : "New Product"}</h2>
        <p className="mt-1 text-sm text-slate-500">Maintain the commercial master record used by sales, inventory and procurement.</p>
      </div>

      {error && (
        <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="SKU" value={form.sku} onChange={(v) => updateField("sku", v)} required />
        <Field label="Product Name" value={form.name} onChange={(v) => updateField("name", v)} required />
        <Field label="Brand" value={form.brand} onChange={(v) => updateField("brand", v)} />
        <Field label="Category" value={form.category} onChange={(v) => updateField("category", v)} />
        <Field label="Supplier ID" value={form.supplierId} onChange={(v) => updateField("supplierId", v)} />
        <Field label="OEM / Barcode" value={form.barcode} onChange={(v) => updateField("barcode", v)} />

        <NumberField label="Cost Price" value={form.costPrice} onChange={(v) => updateField("costPrice", v)} />
        <NumberField label="Selling Price" value={form.sellingPrice} onChange={(v) => updateField("sellingPrice", v)} />
        <NumberField label="Quantity on Hand" value={form.quantity} onChange={(v) => updateField("quantity", v)} />
        <NumberField label="Minimum Stock" value={form.minimumStock} onChange={(v) => updateField("minimumStock", v)} />

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
          <select className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-blue-500" value={form.status} onChange={(e) => updateField("status", e.target.value as Product["status"])}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Discontinued">Discontinued</option>
          </select>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Commercial margin</div>
          <div className="mt-1 text-xl font-bold text-slate-900">R {margin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className={`mt-1 text-sm font-medium ${marginPercent >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            {marginPercent.toFixed(1)}% gross margin on selling price
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={submit}>{product ? "Save Changes" : "Create Product"}</Button>
      </div>
    </Card>
  );
}

function Field({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}{required && <span className="ml-1 text-red-500">*</span>}</label>
      <input className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-blue-500" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      <input type="number" min="0" step="0.01" className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-blue-500" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}
