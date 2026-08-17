"use client";

import {
  Package,
  Truck,
  Car,
  Users,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import SectionCard from "@/components/ui/SectionCard";
import NotificationCenter from "@/components/notifications/NotificationCenter";

export default function DashboardPage() {

  return (

    <div className="space-y-8">

      <PageHeader
        title="Enterprise Dashboard"
        subtitle="South African Automotive Intelligence Platform"
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Suppliers"
          value={124}
          subtitle="Registered Suppliers"
          icon={<Truck size={28} />}
        />

        <StatCard
          title="Products"
          value={4528}
          subtitle="Catalogue Items"
          icon={<Package size={28} />}
        />

        <StatCard
          title="Vehicles"
          value={18976}
          subtitle="Vehicle Fitments"
          icon={<Car size={28} />}
        />

        <StatCard
          title="Customers"
          value={389}
          subtitle="Active Customers"
          icon={<Users size={28} />}
        />

        <StatCard
          title="Orders"
          value={58}
          subtitle="Open Orders"
          icon={<ShoppingCart size={28} />}
        />

        <StatCard
          title="Revenue"
          value="R2.84M"
          subtitle="This Month"
          icon={<TrendingUp size={28} />}
          color="text-green-600"
        />

      </div>

      <div className="grid gap-8 xl:grid-cols-3">

        <div className="xl:col-span-2">

          <SectionCard
            title="Enterprise Overview"
            subtitle="SAIP Core Status"
          >

            <div className="space-y-4">

              <div className="rounded-xl border bg-green-50 p-4">

                <h3 className="font-semibold text-green-700">

                  Enterprise Core Online

                </h3>

                <p className="mt-1 text-sm text-green-600">

                  Layout, navigation, supplier module,
                  notification system and enterprise shell
                  are operational.

                </p>

              </div>

              <div className="rounded-xl border p-4">

                <h3 className="font-semibold">

                  Current Development

                </h3>

                <p className="mt-2 text-slate-600">

                  Building the SAIP Enterprise platform
                  module-by-module using a shared enterprise
                  architecture.

                </p>

              </div>

            </div>

          </SectionCard>

        </div>

        <NotificationCenter />

      </div>

    </div>

  );

}