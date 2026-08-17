"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import { Supplier } from "@/types/supplier";

interface Props {
  supplier?: Supplier;
  onSave: (supplier: Supplier) => void;
  onCancel: () => void;
}

const provinces = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
];

const paymentTerms = [
  "COD",
  "7 Days",
  "14 Days",
  "30 Days",
  "60 Days",
  "90 Days",
];

const emptySupplier: Supplier = {
  id: "",
  company: "",
  contactPerson: "",
  email: "",
  phone: "",
  province: "",
  paymentTerms: "",
  supplierScore: 0,
  status: "Pending",
  createdAt: "",
  updatedAt: "",
};

export default function SupplierForm({
  supplier,
  onSave,
  onCancel,
}: Props) {

  const [form, setForm] =
    useState<Supplier>(emptySupplier);

  useEffect(() => {

    if (supplier) {

      setForm(supplier);

    } else {

      const now =
        new Date().toISOString();

      setForm({
        ...emptySupplier,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      });

    }

  }, [supplier]);

  function updateField<K extends keyof Supplier>(
    field: K,
    value: Supplier[K]
  ) {

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

  }

  function calculateScore() {

    let score = 40;

    if (form.company) score += 10;
    if (form.contactPerson) score += 10;
    if (form.phone) score += 10;
    if (form.email) score += 10;
    if (form.province) score += 10;
    if (form.paymentTerms) score += 10;

    if (score > 100) score = 100;

    return score;

  }

  function submit() {

    const supplierToSave: Supplier = {
      ...form,
      supplierScore: calculateScore(),
      updatedAt: new Date().toISOString(),
    };

    onSave(supplierToSave);

  }

  return (

    <Card className="w-full">

      <h2 className="mb-6 text-2xl font-bold">

        {supplier
          ? "Edit Supplier"
          : "New Supplier"}

      </h2>

      <div className="grid gap-5 md:grid-cols-2">

        <div>

          <label className="mb-2 block font-medium">
            Company
          </label>

          <input
            className="w-full rounded-xl border border-slate-300 p-3"
            value={form.company}
            onChange={(e) =>
              updateField(
                "company",
                e.target.value
              )
            }
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Contact Person
          </label>

          <input
            className="w-full rounded-xl border border-slate-300 p-3"
            value={form.contactPerson}
            onChange={(e) =>
              updateField(
                "contactPerson",
                e.target.value
              )
            }
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Email
          </label>

          <input
            type="email"
            className="w-full rounded-xl border border-slate-300 p-3"
            value={form.email}
            onChange={(e) =>
              updateField(
                "email",
                e.target.value
              )
            }
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Phone
          </label>

          <input
            className="w-full rounded-xl border border-slate-300 p-3"
            value={form.phone}
            onChange={(e) =>
              updateField(
                "phone",
                e.target.value
              )
            }
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Province
          </label>

          <select
            className="w-full rounded-xl border border-slate-300 p-3"
            value={form.province}
            onChange={(e) =>
              updateField(
                "province",
                e.target.value
              )
            }
          >

            <option value="">
              Select Province
            </option>

            {provinces.map((province) => (

              <option
                key={province}
                value={province}
              >
                {province}
              </option>

            ))}

          </select>

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Payment Terms
          </label>

          <select
            className="w-full rounded-xl border border-slate-300 p-3"
            value={form.paymentTerms}
            onChange={(e) =>
              updateField(
                "paymentTerms",
                e.target.value
              )
            }
          >

            <option value="">
              Select Terms
            </option>

            {paymentTerms.map((term) => (

              <option
                key={term}
                value={term}
              >
                {term}
              </option>

            ))}

          </select>

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Status
          </label>

          <select
            className="w-full rounded-xl border border-slate-300 p-3"
            value={form.status}
            onChange={(e) =>
              updateField(
                "status",
                e.target.value as Supplier["status"]
              )
            }
          >

            <option value="Pending">
              Pending
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Supplier Score
          </label>

          <div className="rounded-xl bg-slate-100 p-3 text-center text-2xl font-bold text-blue-700">

            {calculateScore()} / 100

          </div>

        </div>

      </div>

      <div className="mt-8 flex justify-end gap-3">

        <Button
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          onClick={submit}
        >
          Save Supplier
        </Button>

      </div>

    </Card>

  );

}