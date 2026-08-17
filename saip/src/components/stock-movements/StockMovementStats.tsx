"use client";

import {
  ShoppingCart,
  DollarSign,
  ArrowLeftRight,
  Wrench,
  Activity,
  TrendingUp,
} from "lucide-react";

import StatCard from "@/components/ui/StatCard";

interface StockMovementStatistics {

  totalMovements: number;

  purchases: number;

  sales: number;

  adjustments: number;

  transfers: number;

  totalValue: number;

}

interface Props {

  statistics: StockMovementStatistics;

}

export default function StockMovementStats({

  statistics,

}: Props) {

  return (

    <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-6">

      <StatCard
        title="Transactions"
        value={statistics.totalMovements}
        subtitle="Total Movements"
        icon={<Activity size={28} />}
      />

      <StatCard
        title="Purchases"
        value={statistics.purchases}
        subtitle="Stock Received"
        icon={<ShoppingCart size={28} />}
        color="text-green-600"
      />

      <StatCard
        title="Sales"
        value={statistics.sales}
        subtitle="Stock Issued"
        icon={<DollarSign size={28} />}
        color="text-blue-600"
      />

      <StatCard
        title="Transfers"
        value={statistics.transfers}
        subtitle="Warehouse Moves"
        icon={<ArrowLeftRight size={28} />}
        color="text-indigo-600"
      />

      <StatCard
        title="Adjustments"
        value={statistics.adjustments}
        subtitle="Manual Changes"
        icon={<Wrench size={28} />}
        color="text-amber-600"
      />

      <StatCard
        title="Movement Value"
        value={`R ${statistics.totalValue.toLocaleString()}`}
        subtitle="Transaction Value"
        icon={<TrendingUp size={28} />}
        color="text-emerald-600"
      />

    </div>

  );

}