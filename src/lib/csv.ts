import { Supplier } from "@/types/supplier";

export function exportSuppliersCSV(
  suppliers: Supplier[]
) {
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
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = "suppliers.csv";
  link.click();

  URL.revokeObjectURL(url);
}

export function importSuppliersCSV(
  file: File
): Promise<Supplier[]> {

  return new Promise((resolve) => {

    const reader =
      new FileReader();

    reader.onload = () => {

      const text =
        reader.result as string;

      const lines =
        text
          .split("\n")
          .filter(
            line => line.trim() !== ""
          );

      const suppliers =
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

      resolve(suppliers);

    };

    reader.readAsText(file);

  });

}