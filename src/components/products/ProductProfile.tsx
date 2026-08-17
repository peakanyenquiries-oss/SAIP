"use client";

import Card from "@/components/ui/Card";

import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductProfile({
  product,
}: Props) {

  const stockStatus =
    product.quantity <= product.minimumStock
      ? "Low Stock"
      : "In Stock";

  const stockColor =
    product.quantity <= product.minimumStock
      ? "text-red-600"
      : "text-green-600";

  const margin =
    product.sellingPrice - product.costPrice;

  const markup =
    product.costPrice === 0
      ? 0
      : (
          (margin /
            product.costPrice) *
          100
        ).toFixed(1);

  return (

    <Card>

      <div className="mb-8">

        <h2 className="text-2xl font-bold">

          {product.name}

        </h2>

        <p className="text-slate-500">

          {product.brand}

        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <Info
          label="SKU"
          value={product.sku}
        />

        <Info
          label="Barcode"
          value={product.barcode}
        />

        <Info
          label="Category"
          value={product.category}
        />

        <Info
          label="Supplier"
          value={product.supplierId}
        />

        <Info
          label="Cost Price"
          value={`R ${product.costPrice.toLocaleString()}`}
        />

        <Info
          label="Selling Price"
          value={`R ${product.sellingPrice.toLocaleString()}`}
        />

        <Info
          label="Profit"
          value={`R ${margin.toLocaleString()}`}
        />

        <Info
          label="Markup"
          value={`${markup}%`}
        />

        <Info
          label="Quantity"
          value={product.quantity}
        />

        <Info
          label="Minimum Stock"
          value={product.minimumStock}
        />

        <div>

          <p className="text-sm text-slate-500">

            Stock Status

          </p>

          <p
            className={`mt-1 font-semibold ${stockColor}`}
          >

            {stockStatus}

          </p>

        </div>

        <div>

          <p className="text-sm text-slate-500">

            Status

          </p>

          <p className="mt-1 font-semibold">

            {product.status}

          </p>

        </div>

      </div>

    </Card>

  );

}

interface InfoProps {

  label: string;

  value: string | number;

}

function Info({
  label,
  value,
}: InfoProps) {

  return (

    <div>

      <p className="text-sm text-slate-500">

        {label}

      </p>

      <p className="mt-1 font-semibold">

        {value}

      </p>

    </div>

  );

}