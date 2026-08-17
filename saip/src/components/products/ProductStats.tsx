"use client";

import {
  Package,
  Boxes,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

import StatCard from "@/components/ui/StatCard";

interface ProductStatistics {

  totalProducts: number;

  activeProducts: number;

  inactiveProducts: number;

  discontinuedProducts: number;

  lowStockProducts: number;

  inventoryValue: number;

}

interface Props {

  statistics: ProductStatistics;

}

export default function ProductStats({
  statistics,
}: Props) {

  return (

    <div className="grid gap-6 lg:grid-cols-4">

      <StatCard
        title="Products"
        value={statistics.totalProducts}
        subtitle="Catalogue"
        icon={<Package size={28} />}
      />

      <StatCard
        title="Active"
        value={statistics.activeProducts}
        subtitle="Available"
        icon={<Boxes size={28} />}
        color="text-green-600"
      />

      <StatCard
        title="Low Stock"
        value={statistics.lowStockProducts}
        subtitle="Needs Reorder"
        icon={<AlertTriangle size={28} />}
        color="text-amber-500"
      />

      <StatCard
        title="Inventory Value"
        value={`R ${statistics.inventoryValue.toLocaleString()}`}
        subtitle="Current Stock Value"
        icon={<TrendingUp size={28} />}
        color="text-blue-600"
      />

    </div>

  );

}