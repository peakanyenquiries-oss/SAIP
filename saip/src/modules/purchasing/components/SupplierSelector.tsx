"use client";

import { Supplier } from "@/types/supplier";

interface Props {

  suppliers: Supplier[];

  value: string;

  onChange(value: string): void;

}

export default function SupplierSelector({

  suppliers,

  value,

  onChange,

}: Props) {

  return (

    <select

      value={value}

      onChange={(e) =>
        onChange(
          e.target.value
        )
      }

      className="w-full rounded-xl border p-3"

    >

      <option value="">

        Select Supplier

      </option>

      {suppliers.map(

        supplier => (

          <option

            key={supplier.id}

            value={supplier.id}

          >

            {supplier.company}

          </option>

        )

      )}

    </select>

  );

}