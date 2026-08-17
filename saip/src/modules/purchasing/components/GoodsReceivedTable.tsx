"use client";

import {
  CheckCircle2,
  Package,
  Truck,
} from "lucide-react";

import DataTable, {
  Column,
} from "@/components/ui/DataTable";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

import {
  PurchaseOrder,
} from "@/types/purchase-order";

interface GoodsReceivedTableProps {

  purchaseOrders: PurchaseOrder[];

  onReceive(
    purchaseOrder: PurchaseOrder
  ): void;

}

export default function GoodsReceivedTable({

  purchaseOrders,

  onReceive,

}: GoodsReceivedTableProps) {

  function badgeVariant(
    status: PurchaseOrder["status"]
  ) {

    switch (status) {

      case "Ordered":
        return "primary";

      case "Partially Received":
        return "purple";

      case "Completed":
        return "success";

      default:
        return "secondary";

    }

  }

  const columns:
    Column<PurchaseOrder>[] = [

    {

      title: "PO Number",

      width: "170px",

      render: order => (

        <div className="flex items-center gap-2">

          <Truck
            size={16}
            className="text-blue-600"
          />

          <span className="font-semibold">

            {order.poNumber}

          </span>

        </div>

      ),

    },

    {

      title: "Supplier",

      render: order => (

        <div>

          <p className="font-medium">

            {order.supplierName}

          </p>

          <p className="text-xs text-slate-500">

            {order.items.length} item(s)

          </p>

        </div>

      ),

    },

    {

      title: "Products",

      width: "130px",

      render: order => (

        <div className="flex items-center gap-2">

          <Package
            size={16}
            className="text-slate-500"
          />

          <span>

            {order.items.length}

          </span>

        </div>

      ),

    },
        {

      title: "Expected Delivery",

      width: "180px",

      render: order => (

        <span>

          {new Date(
            order.expectedDeliveryDate
          ).toLocaleDateString()}

        </span>

      ),

    },

    {

      title: "Status",

      width: "180px",

      render: order => (

        <Badge
          variant={badgeVariant(
            order.status
          )}
        >

          {order.status}

        </Badge>

      ),

    },

    {

      title: "Action",

      width: "170px",

      render: order => (

        <Button

          onClick={() =>

            onReceive(order)

          }

        >

          <CheckCircle2
            size={18}
          />

          Receive

        </Button>

      ),

    },

  ];

  return (

    <DataTable

      columns={columns}

      data={purchaseOrders}

      emptyMessage="No purchase orders awaiting delivery."

    />

  );

}