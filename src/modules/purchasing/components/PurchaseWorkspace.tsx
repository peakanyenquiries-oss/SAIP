"use client";

import { useMemo, useState } from "react";

import {
  Plus,
  ShoppingCart,
  Clock3,
  PackageCheck,
  Wallet,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import StatCard from "@/components/ui/StatCard";

import PurchaseOrderForm from "../components/PurchaseOrderForm";
import PurchaseOrderTable from "../components/PurchaseOrderTable";

import usePurchaseOrders from "../hooks/usePurchaseOrders";

import { Product } from "@/types/product";
import { Supplier } from "@/types/supplier";
import { PurchaseOrder } from "@/types/purchase-order";

interface PurchaseWorkspaceProps {

  suppliers: Supplier[];

  products: Product[];

}

export default function PurchaseWorkspace({

  suppliers,

  products,

}: PurchaseWorkspaceProps) {

  const {

    orders,

    create,

  } = usePurchaseOrders();

  const [createModalOpen, setCreateModalOpen] =
    useState(false);

  const totalPurchaseOrders =
    orders.length;

  const pendingApproval =
    useMemo(() => {

      return orders.filter(

        order =>
          order.status ===
          "Pending Approval"

      ).length;

    }, [orders]);

  const completedOrders =
    useMemo(() => {

      return orders.filter(

        order =>
          order.status ===
          "Completed"

      ).length;

    }, [orders]);

  const totalValue =
    useMemo(() => {

      return orders.reduce(

        (total, order) =>

          total + order.total,

        0

      );

    }, [orders]);

  function handleCreatePurchaseOrder(

    order: PurchaseOrder

  ) {

    create(order);

    setCreateModalOpen(false);

  }

  function handleView(

    order: PurchaseOrder

  ) {

    console.log(

      "View Purchase Order",

      order

    );

  }

  function handleEdit(

    order: PurchaseOrder

  ) {

    console.log(

      "Edit Purchase Order",

      order

    );

  }

  function handleDelete(

    order: PurchaseOrder

  ) {

    console.log(

      "Deleted",

      order

    );

  }

  return (

    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">

            Purchasing Workspace

          </h1>

          <p className="mt-2 text-slate-500">

            Manage purchase orders,
            supplier procurement,
            and goods receiving.

          </p>

        </div>

        <Button

          onClick={() =>

            setCreateModalOpen(true)

          }

        >

          <Plus size={18} />

          New Purchase Order

        </Button>

      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard

          title="Purchase Orders"

          value={totalPurchaseOrders}

          subtitle="Total Purchase Orders"

          icon={<ShoppingCart size={24} />}

          color="blue"

        />

        <StatCard

          title="Pending Approval"

          value={pendingApproval}

          subtitle="Awaiting Approval"

          icon={<Clock3 size={24} />}

          color="yellow"

        />
                <StatCard

          title="Completed"

          value={completedOrders}

          subtitle="Successfully Completed"

          icon={<PackageCheck size={24} />}

          color="green"

        />

        <StatCard

          title="Purchase Value"

          value={new Intl.NumberFormat(
            "en-ZA",
            {
              style: "currency",
              currency: "ZAR",
              maximumFractionDigits: 0,
            }
          ).format(totalValue)}

          subtitle="Total Procurement"

          icon={<Wallet size={24} />}

          color="purple"

        />

      </div>

      <PurchaseOrderTable

        onView={handleView}

        onEdit={handleEdit}

        onDelete={handleDelete}

      />

      <Modal

        open={createModalOpen}

        title="New Purchase Order"

        onClose={() =>

          setCreateModalOpen(false)

        }

        width="xl"

      >

        <PurchaseOrderForm

          suppliers={suppliers}

          products={products}

          onSave={handleCreatePurchaseOrder}

        />

      </Modal>

    </div>

  );

}