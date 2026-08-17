"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Product } from "@/types/product";

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductStatistics,
} from "@/lib/product-service";

export default function useProducts() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [statistics, setStatistics] =
    useState({
      totalProducts: 0,
      activeProducts: 0,
      inactiveProducts: 0,
      discontinuedProducts: 0,
      lowStockProducts: 0,
      inventoryValue: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const refresh =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          productData,
          statisticsData,
        ] = await Promise.all([
          getProducts(),
          getProductStatistics(),
        ]);

        setProducts(
          productData
        );

        setStatistics(
          statisticsData
        );
      } catch (err) {
        console.error(
          "Failed to load products:",
          err
        );

        setError(
          "Failed to load products."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create =
    useCallback(
      async (
        product: Product
      ) => {
        await addProduct(
          product
        );

        await refresh();
      },
      [refresh]
    );

  const update =
    useCallback(
      async (
        product: Product
      ) => {
        await updateProduct(
          product
        );

        await refresh();
      },
      [refresh]
    );

  const remove =
    useCallback(
      async (
        id: string
      ) => {
        await deleteProduct(
          id
        );

        await refresh();
      },
      [refresh]
    );

  return {
    products,

    statistics,

    loading,

    error,

    create,

    update,

    remove,

    refresh,
  };
}