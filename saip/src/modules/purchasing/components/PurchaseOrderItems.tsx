"use client";

import { PurchaseOrderItem } from "@/types/purchase-order";

interface Props {

  items: PurchaseOrderItem[];

}

export default function PurchaseOrderItems({

  items,

}: Props) {

  return (

    <table className="w-full">

      <thead>

        <tr>

          <th>SKU</th>

          <th>Product</th>

          <th>Qty</th>

          <th>Unit Cost</th>

          <th>Total</th>

        </tr>

      </thead>

      <tbody>

        {items.map(item => (

          <tr key={item.id}>

            <td>{item.sku}</td>

            <td>{item.productName}</td>

            <td>{item.quantity}</td>

            <td>

              R {item.unitCost.toFixed(2)}

            </td>

            <td>

              R {item.lineTotal.toFixed(2)}

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  );

}