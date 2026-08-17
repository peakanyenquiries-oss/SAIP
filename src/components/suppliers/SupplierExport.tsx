"use client";

import { Supplier } from "@/types/supplier";

interface SupplierExportProps {
  suppliers: Supplier[];
}

export default function SupplierExport({
  suppliers,
}: SupplierExportProps) {

  function exportCSV() {

    const headers = [
      "Company",
      "Contact Person",
      "Email",
      "Phone",
      "Province",
      "Payment Terms",
      "Supplier Score",
      "Status",
    ];

    const rows = suppliers.map((supplier) => [

      supplier.company,

      supplier.contactPerson,

      supplier.email,

      supplier.phone,

      supplier.province,

      supplier.paymentTerms,

      supplier.supplierScore,

      supplier.status,

    ]);

    const csv = [

      headers.join(","),

      ...rows.map((row) =>
        row.join(",")
      ),

    ].join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "suppliers.csv";

    link.click();

    URL.revokeObjectURL(url);

  }

  return {

    exportCSV,

  };

}