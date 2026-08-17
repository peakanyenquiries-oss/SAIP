"use client";

import { PurchaseOrder } from "@/types/purchase-order";

import PurchaseOrderItems from "./PurchaseOrderItems";
import PurchaseOrderTimeline from "./PurchaseOrderTimeline";

interface Props {

  purchaseOrder: PurchaseOrder;

}

export default function PurchaseOrderProfile({

  purchaseOrder,

}: Props) {

  return (

    <div className="space-y-8">

      <div className="grid gap-6 md:grid-cols-2">

        <div>

          <h3 className="font-bold">

            {purchaseOrder.poNumber}

          </h3>

          <p>

            {purchaseOrder.supplierName}

          </p>

          <p>

            {purchaseOrder.status}

          </p>

        </div>

        <PurchaseOrderTimeline

          currentStatus={
            purchaseOrder.status
          }

        />

      </div>

      <PurchaseOrderItems

        items={purchaseOrder.items}

      />

    </div>

  );

}