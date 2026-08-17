"use client";

import Button from "@/components/ui/Button";

interface SupplierExportButtonProps {
  onExport: () => void;
}

export default function SupplierExportButton({
  onExport,
}: SupplierExportButtonProps) {

  return (

    <Button
      variant="ghost"
      onClick={onExport}
    >
      Export
    </Button>

  );

}