"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";

import { InventoryItem } from "@/types/inventory";

interface Props {

  item?: InventoryItem;

  onSave(item: InventoryItem): void;

  onCancel(): void;

}

export default function InventoryForm({

  item,

  onSave,

  onCancel,

}: Props) {

  const [form, setForm] = useState<InventoryItem>({

    id: crypto.randomUUID(),

    productId: "",

    sku: "",

    productName: "",

    warehouse: "Main Warehouse",

    location: "",

    quantityOnHand: 0,

    reservedQuantity: 0,

    availableQuantity: 0,

    reorderLevel: 10,

    reorderQuantity: 20,

    unitCost: 0,

    inventoryValue: 0,

    status: "In Stock",

    lastStockMovement: new Date().toISOString(),

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),

  });

  useEffect(() => {

    if (!item)
      return;

    setForm(item);

  }, [item]);

  function updateField<K extends keyof InventoryItem>(

    key: K,

    value: InventoryItem[K]

  ) {

    const updated = {

      ...form,

      [key]: value,

    };

    updated.availableQuantity =

      updated.quantityOnHand -

      updated.reservedQuantity;

    updated.inventoryValue =

      updated.quantityOnHand *

      updated.unitCost;

    if (updated.quantityOnHand <= 0) {

      updated.status = "Out of Stock";

    } else if (

      updated.quantityOnHand <=

      updated.reorderLevel

    ) {

      updated.status = "Low Stock";

    } else if (

      updated.quantityOnHand >=

      updated.reorderQuantity * 5

    ) {

      updated.status = "Overstock";

    } else {

      updated.status = "In Stock";

    }

    updated.updatedAt =

      new Date().toISOString();

    setForm(updated);

  }

  function submit(

    e: React.FormEvent

  ) {

    e.preventDefault();

    onSave(form);

  }

  return (

    <form

      onSubmit={submit}

      className="space-y-6"

    >

      <div className="grid gap-5 md:grid-cols-2">

        <Input
          label="Product Name"
          value={form.productName}
          onChange={(v) =>
            updateField(
              "productName",
              v
            )
          }
        />

        <Input
          label="SKU"
          value={form.sku}
          onChange={(v) =>
            updateField(
              "sku",
              v
            )
          }
        />

        <Input
          label="Warehouse"
          value={form.warehouse}
          onChange={(v) =>
            updateField(
              "warehouse",
              v
            )
          }
        />

        <Input
          label="Location"
          value={form.location}
          onChange={(v) =>
            updateField(
              "location",
              v
            )
          }
        />

        <NumberInput
          label="Quantity"
          value={form.quantityOnHand}
          onChange={(v) =>
            updateField(
              "quantityOnHand",
              v
            )
          }
        />

        <NumberInput
          label="Reserved"
          value={form.reservedQuantity}
          onChange={(v) =>
            updateField(
              "reservedQuantity",
              v
            )
          }
        />

        <NumberInput
          label="Reorder Level"
          value={form.reorderLevel}
          onChange={(v) =>
            updateField(
              "reorderLevel",
              v
            )
          }
        />

        <NumberInput
          label="Reorder Quantity"
          value={form.reorderQuantity}
          onChange={(v) =>
            updateField(
              "reorderQuantity",
              v
            )
          }
        />

        <NumberInput
          label="Unit Cost"
          value={form.unitCost}
          onChange={(v) =>
            updateField(
              "unitCost",
              v
            )
          }
        />

      </div>

      <div className="rounded-xl bg-slate-50 p-5">

        <div className="grid gap-4 md:grid-cols-3">

          <Summary
            title="Available"
            value={form.availableQuantity}
          />

          <Summary
            title="Inventory Value"
            value={`R ${form.inventoryValue.toLocaleString()}`}
          />

          <Summary
            title="Status"
            value={form.status}
          />

        </div>

      </div>

      <div className="flex justify-end gap-3">

        <Button
          variant="ghost"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button type="submit">

          Save Inventory

        </Button>

      </div>

    </form>

  );

}

function Input({

  label,

  value,

  onChange,

}: {

  label: string;

  value: string;

  onChange(v: string): void;

}) {

  return (

    <div>

      <label className="mb-1 block text-sm font-medium">

        {label}

      </label>

      <input

        className="w-full rounded-xl border p-3"

        value={value}

        onChange={(e) =>
          onChange(
            e.target.value
          )
        }

      />

    </div>

  );

}

function NumberInput({

  label,

  value,

  onChange,

}: {

  label: string;

  value: number;

  onChange(v: number): void;

}) {

  return (

    <div>

      <label className="mb-1 block text-sm font-medium">

        {label}

      </label>

      <input

        type="number"

        className="w-full rounded-xl border p-3"

        value={value}

        onChange={(e) =>
          onChange(
            Number(e.target.value)
          )
        }

      />

    </div>

  );

}

function Summary({

  title,

  value,

}: {

  title: string;

  value: string | number;

}) {

  return (

    <div>

      <p className="text-sm text-slate-500">

        {title}

      </p>

      <p className="mt-1 text-lg font-semibold">

        {value}

      </p>

    </div>

  );

}