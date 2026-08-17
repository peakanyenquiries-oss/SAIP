"use client";

import { useCallback, useEffect, useState } from "react";

import { StockMovement } from "@/types/stock-movement";

import {
  getStockMovements,
  addStockMovement,
  deleteStockMovement,
  getStockMovementStatistics,
} from "@/lib/stock-movement-service";

export default function useStockMovements() {
  const [movements, setMovements] = useState<StockMovement[]>([]);

  const [statistics, setStatistics] = useState(
    getStockMovementStatistics()
  );

  const refresh = useCallback(async () => {
    const movementData = await getStockMovements();

    setMovements(movementData);

    setStatistics(getStockMovementStatistics());
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function create(
    movement: StockMovement
  ): Promise<void> {
    await addStockMovement(movement);

    await refresh();
  }

  async function update(
    movement: StockMovement
  ): Promise<void> {
    await deleteStockMovement(movement.id);

    await addStockMovement(movement);

    await refresh();
  }

  async function remove(
    id: string
  ): Promise<void> {
    await deleteStockMovement(id);

    await refresh();
  }

  return {
    movements,
    statistics,
    create,
    update,
    remove,
    refresh,
  };
}