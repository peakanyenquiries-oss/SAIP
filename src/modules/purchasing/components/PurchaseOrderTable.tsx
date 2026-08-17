"use client";

import { useMemo, useState } from "react";

import {
  Eye,
  Pencil,
  Trash2,
  ShoppingCart,
  Calendar,
} from "lucide-react";

import DataTable, {
  Column,
} from "@/components/ui/DataTable";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";

import usePurchaseOrders from "../hooks/usePurchaseOrders";

import {
  PurchaseOrder,
  PurchaseOrderStatus,
} from "@/types/purchase-order";

interface PurchaseOrderTableProps {

  onView?(
    purchaseOrder: PurchaseOrder
  ): void;

  onEdit?(
    purchaseOrder: PurchaseOrder
  ): void;

  onDelete?(
    purchaseOrder: PurchaseOrder
  ): void;

}

export default function PurchaseOrderTable({

  onView,

  onEdit,

  onDelete,

}: PurchaseOrderTableProps) {

  const {

    orders,

    remove,

  } = usePurchaseOrders();

  const [search, setSearch] =
    useState("");

  const filteredOrders =
    useMemo(() => {

      if (!search.trim())
        return orders;

      const value =
        search.toLowerCase();

      return orders.filter(order =>

        order.poNumber
          .toLowerCase()
          .includes(value)

        ||

        order.supplierName
          .toLowerCase()
          .includes(value)

        ||

        order.status
          .toLowerCase()
          .includes(value)

      );

    }, [

      orders,

      search,

    ]);

  function badgeVariant(

    status: PurchaseOrderStatus

  ) {

    switch (status) {

      case "Draft":
        return "secondary";

      case "Pending Approval":
        return "warning";

      case "Approved":
        return "info";

      case "Ordered":
        return "primary";

      case "Partially Received":
        return "purple";

      case "Completed":
        return "success";

      case "Cancelled":
        return "danger";

      default:
        return "secondary";

    }

  }

  function handleDelete(
    order: PurchaseOrder
  ) {

    if (
      !confirm(
        `Delete Purchase Order ${order.poNumber}?`
      )
    ) {
      return;
    }

    remove(order.id);

    onDelete?.(order);

  }

  const columns:
    Column<PurchaseOrder>[] = [

    {
      title: "PO Number",

      width: "170px",

      render: order => (

        <div className="flex items-center gap-2">

          <ShoppingCart
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

            {order.items.length}
            {" "}
            item(s)

          </p>

        </div>

      ),

    },

    {
      title: "Order Date",

      width: "170px",

      render: order => (

        <div className="flex items-center gap-2">

          <Calendar
            size={15}
            className="text-slate-500"
          />

          <span>

            {new Date(
              order.orderDate
            ).toLocaleDateString()}

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
      title: "Total",

      width: "150px",

      align: "right",

      render: order => (

        <span className="font-semibold">

          {new Intl.NumberFormat(
            "en-ZA",
            {
              style: "currency",
              currency: "ZAR",
            }
          ).format(order.total)}

        </span>

      ),

    },

    {
      title: "Status",

      width: "190px",

      align: "center",

      render: order => (

        <Badge
          variant={badgeVariant(order.status)}
        >

          {order.status}

        </Badge>

      ),

    },

    {
      title: "Actions",

      width: "180px",

      align: "center",

      render: order => (

        <div className="flex justify-center gap-2">

          <Button
            variant="ghost"
            onClick={() => onView?.(order)}
            title="View Purchase Order"
          >

            <Eye size={16} />

          </Button>

          <Button
            variant="ghost"
            onClick={() => onEdit?.(order)}
            title="Edit Purchase Order"
          >

            <Pencil size={16} />

          </Button>

          <Button
            variant="ghost"
            onClick={() => handleDelete(order)}
            title="Delete Purchase Order"
          >

            <Trash2
              size={16}
              className="text-red-600"
            />

          </Button>

        </div>

      ),

    },

  ];

  return (

    <div className="space-y-6">

      <div className="flex items-center justify-between gap-4">

        <div className="w-full max-w-md">

          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search purchase orders..."
          />

        </div>

        <div className="text-sm text-slate-500">

          {filteredOrders.length}
          {" "}
          Purchase Order(s)

        </div>

      </div>

      <DataTable
        columns={columns}
        data={filteredOrders}
        emptyMessage="No purchase orders found."
        onRowClick={(order) =>
          onView?.(order)
        }
      />

    </div>

  );

}