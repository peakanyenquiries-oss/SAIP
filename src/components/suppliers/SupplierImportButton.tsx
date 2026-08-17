"use client";

import { useRef } from "react";

import Button from "@/components/ui/Button";

interface SupplierImportButtonProps {
  onSelect: (file: File) => void;
}

export default function SupplierImportButton({
  onSelect,
}: SupplierImportButtonProps) {

  const inputRef =
    useRef<HTMLInputElement>(null);

  function openPicker() {

    inputRef.current?.click();

  }

  return (

    <>

      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(event) => {

          const file =
            event.target.files?.[0];

          if (!file)
            return;

          onSelect(file);

          event.target.value = "";

        }}
      />

      <Button
        variant="ghost"
        onClick={openPicker}
      >
        Import
      </Button>

    </>

  );

}