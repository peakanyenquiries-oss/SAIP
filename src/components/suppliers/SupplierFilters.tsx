"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";

interface SupplierFiltersProps {
  onApply: (filters: {
    status: string;
    province: string;
    minimumScore: number;
  }) => void;

  onReset: () => void;
}

export default function SupplierFilters({
  onApply,
  onReset,
}: SupplierFiltersProps) {

  const [status, setStatus] =
    useState("");

  const [province, setProvince] =
    useState("");

  const [minimumScore, setMinimumScore] =
    useState(0);

  function applyFilters() {

    onApply({

      status,

      province,

      minimumScore,

    });

  }

  function resetFilters() {

    setStatus("");

    setProvince("");

    setMinimumScore(0);

    onReset();

  }

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold text-slate-800">
        Supplier Filters
      </h2>

      <div className="grid gap-5 md:grid-cols-3">

        <div>

          <label className="mb-2 block text-sm font-medium">
            Status
          </label>

          <select
            className="w-full rounded-xl border p-3"
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
          >
            <option value="">
              All Statuses
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Province
          </label>

          <input
            className="w-full rounded-xl border p-3"
            placeholder="Province"
            value={province}
            onChange={(e) =>
              setProvince(
                e.target.value
              )
            }
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Minimum Score
          </label>

          <input
            type="number"
            min={0}
            max={100}
            className="w-full rounded-xl border p-3"
            value={minimumScore}
            onChange={(e) =>
              setMinimumScore(
                Number(
                  e.target.value
                )
              )
            }
          />

        </div>

      </div>

      <div className="mt-8 flex justify-end gap-3">

        <Button
          variant="ghost"
          onClick={resetFilters}
        >
          Reset
        </Button>

        <Button
          onClick={applyFilters}
        >
          Apply Filters
        </Button>

      </div>

    </div>

  );

}