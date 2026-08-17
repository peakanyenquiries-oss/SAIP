"use client";

import {
  Archive,
  Boxes,
  AlertTriangle,
  PackageX,
  TrendingUp,
} from "lucide-react";

import StatCard from "@/components/ui/StatCard";

interface InventoryStatistics {

  totalItems: number;

  totalQuantity: number;

  inventoryValue: number;

  lowStock: number;

  outOfStock: number;

  overstock: number;

}

interface Props {

  statistics: InventoryStatistics;

}

export default function InventoryStats({
  statistics,
}: Props) {

  return (

    <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-6">

      <StatCard
        title="Products"
        value={statistics.totalItems}
        subtitle="Inventory Items"
        icon={<Archive size={28} />}
      />

      <StatCard
        title="Stock"
        value={statistics.totalQuantity}
        subtitle="Units Available"
        icon={<Boxes size={28} />}
      />

      <StatCard
        title="Inventory Value"
        value={`R ${statistics.inventoryValue.toLocaleString()}`}
        subtitle="Current Value"
        icon={<TrendingUp size={28} />}
      />

      <StatCard
        title="Low Stock"
        value={statistics.lowStock}
        subtitle="Needs Reorder"
        icon={<AlertTriangle size={28} />}
        color="text-amber-500"
      />

      <StatCard
        title="Out of Stock"
        value={statistics.outOfStock}
        subtitle="Critical"
        icon={<PackageX size={28} />}
        color="text-red-600"
      />

      <StatCard
        title="Overstock"
        value={statistics.overstock}
        subtitle="Excess Inventory"
        icon={<Boxes size={28} />}
        color="text-blue-600"
      />

    </div>

  );

}