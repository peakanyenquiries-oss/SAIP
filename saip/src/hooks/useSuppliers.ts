"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Supplier,
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/lib/supplier-service";

export default function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getSuppliers();

      setSuppliers(
        [...data].sort((a, b) =>
          a.company.localeCompare(b.company)
        )
      );
    } catch (err) {
      console.error("Failed to load suppliers:", err);
      setError("Failed to load suppliers.");
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(
    async (supplier: Supplier) => {
      await addSupplier(supplier);
      await refresh();
    },
    [refresh]
  );

  const update = useCallback(
    async (supplier: Supplier) => {
      await updateSupplier(supplier);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteSupplier(id);
      await refresh();
    },
    [refresh]
  );

  const getById = useCallback(
    (id: string) => {
      return suppliers.find(
        (supplier) => supplier.id === id
      );
    },
    [suppliers]
  );

  const statistics = useMemo(() => {
    const total = suppliers.length;

    const active = suppliers.filter(
      (supplier) => supplier.status === "Active"
    ).length;

    const pending = suppliers.filter(
      (supplier) => supplier.status === "Pending"
    ).length;

    const inactive = suppliers.filter(
      (supplier) => supplier.status === "Inactive"
    ).length;

    const averageScore =
      total === 0
        ? 0
        : Math.round(
            suppliers.reduce(
              (sum, supplier) =>
                sum + supplier.supplierScore,
              0
            ) / total
          );

    return {
      total,
      active,
      pending,
      inactive,
      averageScore,
    };
  }, [suppliers]);

  return {
    suppliers,
    statistics,
    loading,
    error,
    create,
    update,
    remove,
    getById,
    refresh,
  };
}