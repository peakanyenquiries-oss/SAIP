"use client";

import { useMemo, useState } from "react";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import Button from "@/components/ui/Button";
import DataTable, {
  Column,
} from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import SectionCard from "@/components/ui/SectionCard";

import SupplierForm from "@/components/forms/SupplierForm";
import SupplierStats from "@/components/suppliers/SupplierStats";
import SupplierProfile from "@/components/suppliers/SupplierProfile";
import SupplierHistory, {
  SupplierHistoryItem,
} from "@/components/suppliers/SupplierHistory";
import DeleteSupplierDialog from "@/components/suppliers/DeleteSupplierDialog";
import SupplierToolbar from "@/components/suppliers/SupplierToolbar";
import SupplierFilters from "@/components/suppliers/SupplierFilters";

import useSuppliers from "@/hooks/useSuppliers";

import { Supplier } from "@/types/supplier";

import {
  exportSuppliersCSV,
} from "@/lib/csv";

export default function SuppliersPage() {

  const {
    suppliers,
    statistics,
    create,
    update,
    remove,
    refresh,
  } = useSuppliers();

  const [search, setSearch] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  const [selectedSupplier, setSelectedSupplier] =
    useState<Supplier>();

  const [statusFilter, setStatusFilter] =
    useState("");

  const [provinceFilter, setProvinceFilter] =
    useState("");

  const [minimumScore, setMinimumScore] =
    useState(0);

  const history: SupplierHistoryItem[] =
    useMemo(() => {

      if (!selectedSupplier)
        return [];

      return [

        {
          id: "1",
          title: "Supplier Created",
          description:
            "Supplier registered in SAIP.",
          date: new Date(
            selectedSupplier.createdAt
          ).toLocaleString(),
          type: "created",
        },

        {
          id: "2",
          title: "Supplier Updated",
          description:
            "Supplier information updated.",
          date: new Date(
            selectedSupplier.updatedAt
          ).toLocaleString(),
          type: "updated",
        },

      ];

    }, [selectedSupplier]);

  const filteredSuppliers =
    useMemo(() => {

      const keyword =
        search.toLowerCase();

      return suppliers.filter(
        supplier => {

          const matchesSearch =

            supplier.company
              .toLowerCase()
              .includes(keyword)

            ||

            supplier.contactPerson
              .toLowerCase()
              .includes(keyword)

            ||

            supplier.email
              .toLowerCase()
              .includes(keyword)

            ||

            supplier.phone
              .toLowerCase()
              .includes(keyword)

            ||

            supplier.province
              .toLowerCase()
              .includes(keyword);

          const matchesStatus =

            statusFilter === ""

            ||

            supplier.status ===
            statusFilter;

          const matchesProvince =

            provinceFilter === ""

            ||

            supplier.province
              .toLowerCase()
              .includes(
                provinceFilter.toLowerCase()
              );

          const matchesScore =

            supplier.supplierScore >=
            minimumScore;

          return (

            matchesSearch

            &&

            matchesStatus

            &&

            matchesProvince

            &&

            matchesScore

          );

        }

      );

    }, [

      suppliers,

      search,

      statusFilter,

      provinceFilter,

      minimumScore,

    ]);
      function saveSupplier(
    supplier: Supplier
  ) {

    const exists =
      suppliers.some(
        s => s.id === supplier.id
      );

    if (exists) {

      update(supplier);

    } else {

      create(supplier);

    }

    setFormOpen(false);

    setSelectedSupplier(
      undefined
    );

  }

  function editSupplier(
    supplier: Supplier
  ) {

    setSelectedSupplier(
      supplier
    );

    setFormOpen(true);

  }

  function viewSupplier(
    supplier: Supplier
  ) {

    setSelectedSupplier(
      supplier
    );

    setProfileOpen(true);

  }

  function askDelete(
    supplier: Supplier
  ) {

    setSelectedSupplier(
      supplier
    );

    setDeleteOpen(true);

  }

  function deleteCurrentSupplier() {

    if (!selectedSupplier)
      return;

    remove(
      selectedSupplier.id
    );

    setDeleteOpen(false);

    setSelectedSupplier(
      undefined
    );

  }

  const columns:
    Column<Supplier>[] = [

    {

      title: "Company",

      render: supplier =>
        supplier.company,

    },

    {

      title: "Contact",

      render: supplier =>
        supplier.contactPerson,

    },

    {

      title: "Phone",

      render: supplier =>
        supplier.phone,

    },

    {

      title: "Province",

      render: supplier =>
        supplier.province,

    },

    {

      title: "Score",

      render: supplier =>
        `${supplier.supplierScore}/100`,

    },

    {

      title: "Status",

      render: supplier =>
        supplier.status,

    },

    {

      title: "Actions",

      render: supplier => (

        <div className="flex gap-2">

          <button
            className="rounded-lg p-2 hover:bg-slate-100"
            onClick={() =>
              viewSupplier(
                supplier
              )
            }
          >

            <Eye size={18} />

          </button>

          <button
            className="rounded-lg p-2 hover:bg-slate-100"
            onClick={() =>
              editSupplier(
                supplier
              )
            }
          >

            <Pencil size={18} />

          </button>

          <button
            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
            onClick={() =>
              askDelete(
                supplier
              )
            }
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
        title="Suppliers"
        subtitle="Supplier Management"
      />

      <SupplierStats
        suppliers={suppliers}
      />

      <SectionCard
        title="Supplier Database"
        subtitle="Manage suppliers across South Africa."
      >

        <SupplierToolbar

          search={search}

          onSearchChange={
            setSearch
          }

          onAddSupplier={() => {

            setSelectedSupplier(
              undefined
            );

            setFormOpen(true);

          }}

          onRefresh={
            refresh
          }

          onImport={() => {

            console.log(
              "Import Suppliers"
            );

          }}

          onExport={() => {

            exportSuppliersCSV(
              filteredSuppliers
            );

          }}

          onFilter={() => {

            setFiltersOpen(
              true
            );

          }}

        />

        <div className="mt-6">

          <DataTable
            columns={columns}
            data={
              filteredSuppliers
            }
            emptyMessage="No suppliers found."
          />

        </div>

      </SectionCard>
            <Modal
        open={filtersOpen}
        title="Supplier Filters"
        onClose={() => {
          setFiltersOpen(false);
        }}
      >

        <SupplierFilters

          onApply={(filters) => {

            setStatusFilter(
              filters.status
            );

            setProvinceFilter(
              filters.province
            );

            setMinimumScore(
              filters.minimumScore
            );

            setFiltersOpen(false);

          }}

          onReset={() => {

            setStatusFilter("");

            setProvinceFilter("");

            setMinimumScore(0);

            setFiltersOpen(false);

          }}

        />

      </Modal>

      <Modal
        open={formOpen}
        title={
          selectedSupplier
            ? "Edit Supplier"
            : "New Supplier"
        }
        onClose={() => {

          setFormOpen(false);

          setSelectedSupplier(
            undefined
          );

        }}
      >

        <SupplierForm
          supplier={selectedSupplier}
          onSave={saveSupplier}
          onCancel={() => {

            setFormOpen(false);

            setSelectedSupplier(
              undefined
            );

          }}
        />

      </Modal>

      <Modal
        open={profileOpen}
        title="Supplier Profile"
        onClose={() => {

          setProfileOpen(false);

          setSelectedSupplier(
            undefined
          );

        }}
      >

        {selectedSupplier && (

          <div className="space-y-6">

            <SupplierProfile
              supplier={selectedSupplier}
            />

            <SupplierHistory
              history={history}
            />

          </div>

        )}

      </Modal>

      <DeleteSupplierDialog
        open={deleteOpen}
        supplierName={
          selectedSupplier?.company ??
          ""
        }
        onCancel={() => {

          setDeleteOpen(false);

          setSelectedSupplier(
            undefined
          );

        }}
        onDelete={
          deleteCurrentSupplier
        }
      />

    </div>

  );

}