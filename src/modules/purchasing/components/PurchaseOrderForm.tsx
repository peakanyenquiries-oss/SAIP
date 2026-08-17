"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import Button from "@/components/ui/Button";
import SupplierSelector from "./SupplierSelector";

import { Supplier } from "@/types/supplier";
import { Product } from "@/types/product";
import {
  PurchaseOrder,
  PurchaseOrderItem,
} from "@/types/purchase-order";

import {
  calculateLineTotal,
  calculatePurchaseTotals,
} from "../utils/purchase-calculator";

import {
  generatePurchaseOrderNumber,
} from "@/lib/purchase-order-service";

interface Props {
  suppliers: Supplier[];
  products: Product[];
  onSave(order: PurchaseOrder): void;
}

export default function PurchaseOrderForm({
  suppliers,
  products,
  onSave,
}: Props) {

  const [supplierId, setSupplierId] =
    useState("");

  const [items, setItems] =
    useState<PurchaseOrderItem[]>([]);

  const supplier =
    suppliers.find(
      s => s.id === supplierId
    );

  const totals =
    useMemo(() => {

      return calculatePurchaseTotals(
        items
      );

    }, [items]);

  function addItem() {

    setItems(current => [

      ...current,

      {

        id: crypto.randomUUID(),

        productId: "",

        sku: "",

        productName: "",

        quantity: 1,

        unitCost: 0,

        lineTotal: 0,

      },

    ]);

  }

  function removeItem(id: string) {

    setItems(current =>

      current.filter(

        item => item.id !== id

      )

    );

  }

  function updateItem(

    id: string,

    changes: Partial<PurchaseOrderItem>

  ) {

    setItems(current =>

      current.map(item => {

        if (item.id !== id)
          return item;

        const updated = {

          ...item,

          ...changes,

        };

        updated.lineTotal =
          calculateLineTotal(

            updated.quantity,

            updated.unitCost

          );

        return updated;

      })

    );

  }

  function selectProduct(

    id: string,

    productId: string

  ) {

    const product =
      products.find(

        p => p.id === productId

      );

    if (!product)
      return;

    updateItem(id, {

      productId,

      sku: product.sku,

      productName: product.name,

      unitCost: product.costPrice,

    });

  }

  function save() {

    if (!supplier)
      return;

    const order: PurchaseOrder = {

      id: crypto.randomUUID(),

      poNumber:
        generatePurchaseOrderNumber(),

      supplierId:
        supplier.id,

      supplierName:
        supplier.company,

      orderDate:
        new Date().toISOString(),

      expectedDeliveryDate:
        new Date().toISOString(),

      status: "Draft",

      items,

      subtotal:
        totals.subtotal,

      vat:
        totals.vat,

      total:
        totals.total,

      notes: "",

      createdBy: "Administrator",

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),

    };

    onSave(order);

    setSupplierId("");

    setItems([]);

  }

  return (

    <div className="space-y-8 rounded-xl bg-white p-6 shadow">

      <SupplierSelector

        suppliers={suppliers}

        value={supplierId}

        onChange={setSupplierId}

      />

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="p-2 text-left">

              Product

            </th>

            <th className="p-2">

              Qty

            </th>

            <th className="p-2">

              Unit Cost

            </th>

            <th className="p-2">

              Total

            </th>

            <th />

          </tr>

        </thead>

        <tbody>

          {items.map(item => (

            <tr key={item.id}>

              <td className="p-2">

                <select

                  value={item.productId}

                  onChange={(e) =>

                    selectProduct(

                      item.id,

                      e.target.value

                    )

                  }

                  className="w-full rounded-lg border p-2"

                >

                  <option value="">

                    Select Product

                  </option>

                  {products.map(product => (

                    <option

                      key={product.id}

                      value={product.id}

                    >

                      {product.name}

                    </option>

                  ))}

                </select>

              </td>

              <td className="p-2">

                <input

                  type="number"

                  value={item.quantity}

                  min={1}

                  onChange={(e) =>

                    updateItem(

                      item.id,

                      {

                        quantity:
                          Number(

                            e.target.value

                          ),

                      }

                    )

                  }

                  className="w-20 rounded-lg border p-2"

                />

              </td>

              <td className="p-2">

                R {item.unitCost.toFixed(2)}

              </td>

              <td className="p-2">

                R {item.lineTotal.toFixed(2)}

              </td>

              <td>

                <button

                  onClick={() =>

                    removeItem(

                      item.id

                    )

                  }

                  className="rounded-lg p-2 text-red-600"

                >

                  <Trash2 size={18} />

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <Button
        onClick={addItem}
      >

        <Plus size={18} />

        Add Product

      </Button>

      <div className="ml-auto w-80 space-y-2">

        <div className="flex justify-between">

          <span>Subtotal</span>

          <span>

            R {totals.subtotal.toFixed(2)}

          </span>

        </div>

        <div className="flex justify-between">

          <span>VAT</span>

          <span>

            R {totals.vat.toFixed(2)}

          </span>

        </div>

        <div className="flex justify-between text-lg font-bold">

          <span>Total</span>

          <span>

            R {totals.total.toFixed(2)}

          </span>

        </div>

      </div>

      <div className="flex justify-end">

        <Button
          onClick={save}
        >

          Save Purchase Order

        </Button>

      </div>

    </div>

  );

}