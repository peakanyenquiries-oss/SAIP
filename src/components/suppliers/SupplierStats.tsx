"use client";

import {
  Truck,
  CheckCircle,
  Clock3,
  XCircle,
  Award,
} from "lucide-react";

import StatCard from "@/components/ui/StatCard";
import { Supplier } from "@/types/supplier";

interface SupplierStatsProps {
  suppliers: Supplier[];
}

export default function SupplierStats({
  suppliers,
}: SupplierStatsProps) {

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

  return (

    <div className="grid gap-6 lg:grid-cols-5">

      <StatCard
        title="Suppliers"
        value={total}
        subtitle="Registered"
        icon={<Truck size={28} />}
      />

      <StatCard
        title="Active"
        value={active}
        subtitle="Trading"
        icon={<CheckCircle size={28} />}
        color="text-green-600"
      />

      <StatCard
        title="Pending"
        value={pending}
        subtitle="Awaiting Approval"
        icon={<Clock3 size={28} />}
        color="text-amber-500"
      />

      <StatCard
        title="Inactive"
        value={inactive}
        subtitle="Disabled"
        icon={<XCircle size={28} />}
        color="text-red-600"
      />

      <StatCard
        title="Average Score"
        value={`${averageScore}/100`}
        subtitle="Supplier Rating"
        icon={<Award size={28} />}
        color="text-blue-600"
      />

    </div>

  );

}