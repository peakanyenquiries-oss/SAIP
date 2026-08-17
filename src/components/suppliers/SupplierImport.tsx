"use client";

import { Supplier } from "@/types/supplier";

interface SupplierImportProps {
  onImport: (suppliers: Supplier[]) => void;
}

export default function SupplierImport({
  onImport,
}: SupplierImportProps) {

  function importCSV(
    file: File
  ) {

    const reader =
      new FileReader();

    reader.onload = () => {

      const text =
        reader.result as string;

      const lines =
        text
          .split("\n")
          .filter(
            line =>
              line.trim() !== ""
          );

      if (lines.length <= 1)
        return;

      const imported: Supplier[] =
        lines
          .slice(1)
          .map((line) => {

            const values =
              line.split(",");

            return {

              id:
                crypto.randomUUID(),

              company:
                values[0] ?? "",

              contactPerson:
                values[1] ?? "",

              email:
                values[2] ?? "",

              phone:
                values[3] ?? "",

              province:
                values[4] ?? "",

              paymentTerms:
                values[5] ?? "",

              supplierScore:
                Number(
                  values[6] ?? 0
                ),

              status:
                (values[7] as Supplier["status"]) ??
                "Pending",

              createdAt:
                new Date().toISOString(),

              updatedAt:
                new Date().toISOString(),

            };

          });

      onImport(imported);

    };

    reader.readAsText(file);

  }

  return {

    importCSV,

  };

}