"use client";

import { useEffect, useState } from "react";

import { InventoryItem } from "@/types/inventory";

import {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryStatistics,
} from "@/lib/inventory-service";

export interface InventoryStatistics {
  totalItems: number;
  totalQuantity: number;
  inventoryValue: number;
  lowStock: number;
  outOfStock: number;
  overstock: number;
}

export default function useInventory() {
  const [inventory, setInventory] =
    useState<InventoryItem[]>([]);

  const [statistics, setStatistics] =
    useState<InventoryStatistics>({
      totalItems: 0,
      totalQuantity: 0,
      inventoryValue: 0,
      lowStock: 0,
      outOfStock: 0,
      overstock: 0,
    });

  const [loading, setLoading] =
    useState<boolean>(true);

  async function refresh(): Promise<void> {
    try {
      setLoading(true);

      const [
        currentInventory,
        currentStatistics,
      ] = await Promise.all([
        getInventory(),
        getInventoryStatistics(),
      ]);

      setInventory(currentInventory);

      setStatistics(currentStatistics);
    } catch (error) {
      console.error(
        "Failed to load inventory:",
        error
      );

      setInventory([]);

      setStatistics({
        totalItems: 0,
        totalQuantity: 0,
        inventoryValue: 0,
        lowStock: 0,
        outOfStock: 0,
        overstock: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function create(
    item: InventoryItem
  ): Promise<void> {
    try {
      await addInventoryItem(item);

      await refresh();
    } catch (error) {
      console.error(
        "Failed to create inventory item:",
        error
      );
    }
  }

  async function update(
    item: InventoryItem
  ): Promise<void> {
    try {
      await updateInventoryItem(item);

      await refresh();
    } catch (error) {
      console.error(
        "Failed to update inventory item:",
        error
      );
    }
  }

  async function remove(
    id: string
  ): Promise<void> {
    try {
      await deleteInventoryItem(id);

      await refresh();
    } catch (error) {
      console.error(
        "Failed to delete inventory item:",
        error
      );
    }
  }

  return {
    inventory,
    statistics,
    loading,
    create,
    update,
    remove,
    refresh,
  };
}