"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import { Product } from "@/types/product";

interface Props {
  product?: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const emptyProduct: Product = {
  id: "",
  sku: "",
  name: "",
  brand: "",
  category: "",
  supplierId: "",
  costPrice: 0,
  sellingPrice: 0,
  quantity: 0,
  minimumStock: 0,
  barcode: "",
  status: "Active",
  createdAt: "",
  updatedAt: "",
};

export default function ProductForm({
  product,
  onSave,
  onCancel,
}: Props) {

  const [form, setForm] =
    useState<Product>(emptyProduct);

  useEffect(() => {

    if (product) {

      setForm(product);

    } else {

      const now =
        new Date().toISOString();

      setForm({

        ...emptyProduct,

        id:
          crypto.randomUUID(),

        createdAt: now,

        updatedAt: now,

      });

    }

  }, [product]);

  function updateField<
    K extends keyof Product
  >(
    field: K,
    value: Product[K]
  ) {

    setForm((previous) => ({

      ...previous,

      [field]: value,

    }));

  }

  function submit() {

    onSave({

      ...form,

      updatedAt:
        new Date().toISOString(),

    });

  }

  return (

    <Card className="w-full max-w-5xl">

      <h2 className="mb-6 text-2xl font-bold">

        {product
          ? "Edit Product"
          : "New Product"}

      </h2>

      <div className="grid gap-5 md:grid-cols-2">

        <div>

          <label className="mb-2 block font-medium">
            SKU
          </label>

          <input
            className="w-full rounded-xl border p-3"
            value={form.sku}
            onChange={(e) =>
              updateField(
                "sku",
                e.target.value
              )
            }
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Product Name
          </label>

          <input
            className="w-full rounded-xl border p-3"
            value={form.name}
            onChange={(e) =>
              updateField(
                "name",
                e.target.value
              )
            }
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Brand
          </label>

          <input
            className="w-full rounded-xl border p-3"
            value={form.brand}
            onChange={(e) =>
              updateField(
                "brand",
                e.target.value
              )
            }
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Category
          </label>

          <input
            className="w-full rounded-xl border p-3"
            value={form.category}
            onChange={(e) =>
              updateField(
                "category",
                e.target.value
              )
            }
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Supplier ID
          </label>

          <input
            className="w-full rounded-xl border p-3"
            value={form.supplierId}
            onChange={(e) =>
              updateField(
                "supplierId",
                e.target.value
              )
            }
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Barcode
          </label>

          <input
            className="w-full rounded-xl border p-3"
            value={form.barcode}
            onChange={(e) =>
              updateField(
                "barcode",
                e.target.value
              )
            }
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Cost Price
          </label>

          <input
            type="number"
            className="w-full rounded-xl border p-3"
            value={form.costPrice}
            onChange={(e) =>
              updateField(
                "costPrice",
                Number(
                  e.target.value
                )
              )
            }
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Selling Price
          </label>

          <input
            type="number"
            className="w-full rounded-xl border p-3"
            value={form.sellingPrice}
            onChange={(e) =>
              updateField(
                "sellingPrice",
                Number(
                  e.target.value
                )
              )
            }
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Quantity
          </label>

          <input
            type="number"
            className="w-full rounded-xl border p-3"
            value={form.quantity}
            onChange={(e) =>
              updateField(
                "quantity",
                Number(
                  e.target.value
                )
              )
            }
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Minimum Stock
          </label>

          <input
            type="number"
            className="w-full rounded-xl border p-3"
            value={form.minimumStock}
            onChange={(e) =>
              updateField(
                "minimumStock",
                Number(
                  e.target.value
                )
              )
            }
          />

        </div>

        <div>

          <label className="mb-2 block font-medium">
            Status
          </label>

          <select
            className="w-full rounded-xl border p-3"
            value={form.status}
            onChange={(e) =>
              updateField(
                "status",
                e.target.value as Product["status"]
              )
            }
          >

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

            <option value="Discontinued">
              Discontinued
            </option>

          </select>

        </div>

      </div>

      <div className="mt-8 flex justify-end gap-3">

        <Button
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          onClick={submit}
        >
          Save Product
        </Button>

      </div>

    </Card>

  );

}