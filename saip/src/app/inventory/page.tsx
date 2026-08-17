"use client";

import { useMemo, useState } from "react";

import {
  Eye,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import Button from "@/components/ui/Button";

import DataTable, {
  Column,
} from "@/components/ui/DataTable";

import Modal from "@/components/ui/Modal";

import PageHeader from "@/components/ui/PageHeader";

import SearchBar from "@/components/ui/SearchBar";

import SectionCard from "@/components/ui/SectionCard";

import InventoryForm from "@/components/forms/InventoryForm";

import InventoryStats from "@/components/inventory/InventoryStats";

import useInventory from "@/hooks/useInventory";

import { InventoryItem } from "@/types/inventory";

export default function InventoryPage() {
  const {
    inventory,
    statistics,
    loading,
    create,
    update,
    remove,
    refresh,
  } = useInventory();

  const [search, setSearch] =
    useState<string>("");

  const [formOpen, setFormOpen] =
    useState<boolean>(false);

  const [deleteOpen, setDeleteOpen] =
    useState<boolean>(false);

  const [selectedItem, setSelectedItem] =
    useState<InventoryItem | undefined>(
      undefined
    );

  const filteredInventory =
    useMemo<InventoryItem[]>(() => {
      const keyword =
        search.trim().toLowerCase();

      if (!keyword) {
        return inventory;
      }

      return inventory.filter(
        (item: InventoryItem) =>
          item.productName
            .toLowerCase()
            .includes(keyword) ||
          item.sku
            .toLowerCase()
            .includes(keyword) ||
          item.warehouse
            .toLowerCase()
            .includes(keyword) ||
          item.location
            .toLowerCase()
            .includes(keyword)
      );
    }, [inventory, search]);

  function openCreateForm(): void {
    setSelectedItem(undefined);
    setFormOpen(true);
  }

  function openEditForm(
    item: InventoryItem
  ): void {
    setSelectedItem(item);
    setFormOpen(true);
  }

  function closeForm(): void {
    setFormOpen(false);
    setSelectedItem(undefined);
  }

  async function saveItem(
    item: InventoryItem
  ): Promise<void> {
    const exists = inventory.some(
      (current: InventoryItem) =>
        current.id === item.id
    );

    if (exists) {
      await update(item);
    } else {
      await create(item);
    }

    closeForm();
  }

  function askDelete(
    item: InventoryItem
  ): void {
    setSelectedItem(item);
    setDeleteOpen(true);
  }

  function closeDeleteModal(): void {
    setDeleteOpen(false);
    setSelectedItem(undefined);
  }

  async function deleteItem(): Promise<void> {
    if (!selectedItem) {
      return;
    }

    await remove(selectedItem.id);

    closeDeleteModal();
  }

  const columns: Column<InventoryItem>[] = [
    {
      title: "SKU",

      render: (item: InventoryItem) =>
        item.sku,
    },

    {
      title: "Product",

      render: (item: InventoryItem) =>
        item.productName,
    },

    {
      title: "Warehouse",

      render: (item: InventoryItem) =>
        item.warehouse,
    },

    {
      title: "Location",

      render: (item: InventoryItem) =>
        item.location,
    },

    {
      title: "Available",

      render: (item: InventoryItem) =>
        item.availableQuantity,
    },

    {
      title: "Inventory Value",

      render: (item: InventoryItem) =>
        `R ${item.inventoryValue.toLocaleString(
          "en-ZA",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}`,
    },

    {
      title: "Status",

      render: (item: InventoryItem) =>
        item.status,
    },

    {
      title: "Actions",

      render: (item: InventoryItem) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg p-2 transition hover:bg-slate-100"
            title="View inventory"
          >
            <Eye size={18} />
          </button>

          <button
            type="button"
            onClick={() =>
              openEditForm(item)
            }
            className="rounded-lg p-2 transition hover:bg-slate-100"
            title="Edit inventory"
          >
            <Pencil size={18} />
          </button>

          <button
            type="button"
            onClick={() =>
              askDelete(item)
            }
            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
            title="Delete inventory"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Inventory"
        subtitle="Warehouse & Stock Management"
        actions={
          <Button
            onClick={openCreateForm}
          >
            <Plus size={18} />

            Add Inventory
          </Button>
        }
      />

      <InventoryStats
        statistics={statistics}
      />

      <SectionCard
        title="Inventory Register"
        subtitle="Manage warehouse stock."
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search inventory..."
            />
          </div>

          <Button
            variant="ghost"
            onClick={() => {
              void refresh();
            }}
          >
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center">
            <div className="text-sm text-slate-500">
              Loading inventory...
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredInventory}
            emptyMessage="No inventory records found."
          />
        )}
      </SectionCard>

      <Modal
        open={formOpen}
        title={
          selectedItem
            ? "Edit Inventory"
            : "New Inventory"
        }
        onClose={closeForm}
      >
        <InventoryForm
          item={selectedItem}
          onSave={saveItem}
          onCancel={closeForm}
        />
      </Modal>

      <Modal
        open={deleteOpen}
        title="Delete Inventory Record"
        onClose={closeDeleteModal}
      >
        <div className="space-y-6">
          <p className="text-slate-600">
            Are you sure you want to permanently
            delete
            <span className="font-semibold">
              {" "}
              {selectedItem?.productName}
            </span>
            ?
          </p>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">
                  SKU
                </p>

                <p className="font-medium">
                  {selectedItem?.sku || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Warehouse
                </p>

                <p className="font-medium">
                  {selectedItem?.warehouse || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Quantity
                </p>

                <p className="font-medium">
                  {selectedItem?.quantityOnHand ?? 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Status
                </p>

                <p className="font-medium">
                  {selectedItem?.status || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={closeDeleteModal}
            >
              Cancel
            </Button>

            <Button
              onClick={() => {
                void deleteItem();
              }}
            >
              Delete Inventory
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}