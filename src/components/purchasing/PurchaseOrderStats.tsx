"use client";

import {
  ShoppingCart,
  Clock3,
  CheckCircle2,
  PackageCheck,
  DollarSign,
  ClipboardList,
} from "lucide-react";

import StatCard from "@/components/ui/StatCard";

interface PurchaseStatistics {

  totalOrders: number;

  draft: number;

  approved: number;

  completed: number;

  outstanding: number;

  totalValue: number;

}

interface Props {

  statistics: PurchaseStatistics;

}

export default function PurchaseOrderStats({

  statistics,

}: Props) {

  return (

    <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-6">

      <StatCard
        title="Purchase Orders"
        value={statistics.totalOrders}
        subtitle="Total Orders"
        icon={<ClipboardList size={28} />}
      />

      <StatCard
        title="Draft"
        value={statistics.draft}
        subtitle="Waiting"
        icon={<Clock3 size={28} />}
        color="text-amber-500"
      />

      <StatCard
        title="Approved"
        value={statistics.approved}
        subtitle="Ready to Order"
        icon={<CheckCircle2 size={28} />}
        color="text-green-600"
      />

      <StatCard
        title="Completed"
        value={statistics.completed}
        subtitle="Received"
        icon={<PackageCheck size={28} />}
        color="text-blue-600"
      />

      <StatCard
        title="Outstanding"
        value={statistics.outstanding}
        subtitle="Open Orders"
        icon={<ShoppingCart size={28} />}
        color="text-purple-600"
      />

      <StatCard
        title="Order Value"
        value={`R ${statistics.totalValue.toLocaleString()}`}
        subtitle="Purchase Spend"
        icon={<DollarSign size={28} />}
        color="text-emerald-600"
      />

    </div>

  );

}