"use client";

import {
  Download,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Upload,
} from "lucide-react";

import Button from "@/components/ui/Button";

interface SupplierToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  onAddSupplier: () => void;
  onRefresh: () => void;
  onImport: () => void;
  onExport: () => void;
  onFilter: () => void;
}

export default function SupplierToolbar({
  search,
  onSearchChange,
  onAddSupplier,
  onRefresh,
  onImport,
  onExport,
  onFilter,
}: SupplierToolbarProps) {
  return (
    <div className="space-y-5">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="relative w-full lg:max-w-md">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            placeholder="Search suppliers..."
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-blue-500"
          />

        </div>

        <div className="flex flex-wrap gap-3">

          <Button
            variant="ghost"
            onClick={onRefresh}
          >
            <RefreshCw size={18} />
            Refresh
          </Button>

          <Button
            variant="ghost"
            onClick={onFilter}
          >
            <Filter size={18} />
            Filters
          </Button>

          <Button
            variant="ghost"
            onClick={onImport}
          >
            <Upload size={18} />
            Import
          </Button>

          <Button
            variant="ghost"
            onClick={onExport}
          >
            <Download size={18} />
            Export
          </Button>

          <Button
            onClick={onAddSupplier}
          >
            <Plus size={18} />
            Add Supplier
          </Button>

        </div>

      </div>

    </div>
  );
}