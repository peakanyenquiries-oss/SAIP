"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  Users,
  X,
} from "lucide-react";

import EnterpriseLayout from "@/components/layout/EnterpriseLayout";
import CustomerTable from "@/components/tables/CustomerTable";
import CustomerForm from "@/components/forms/CustomerForm";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SearchBox from "@/components/ui/SearchBox";

import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "@/services/customerService";

import { Customer } from "@/types/customer";

type ViewMode = "all" | "active" | "inactive";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("all");

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] =
    useState<Customer | undefined>(undefined);

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  async function loadCustomers() {
    try {
      setLoading(true);

      const data = await getCustomers();

      setCustomers(data);
    } catch (error) {
      console.error("Customer loading error:", error);

      alert(
        "Unable to load customers. Please check your Supabase connection."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesStatus =
        viewMode === "all" ||
        (viewMode === "active" && customer.status === "Active") ||
        (viewMode === "inactive" && customer.status === "Inactive");

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableText = [
        customer.firstName,
        customer.lastName,
        customer.company,
        customer.email,
        customer.phone,
        customer.city,
        customer.province,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [customers, search, viewMode]);

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const inactiveCustomers = customers.filter(
    (customer) => customer.status === "Inactive"
  ).length;

  const businessCustomers = customers.filter(
    (customer) => customer.company?.trim()
  ).length;

  function openAddCustomer() {
    setEditingCustomer(undefined);
    setShowForm(true);
  }

  function openEditCustomer(customer: Customer) {
    setEditingCustomer(customer);
    setShowForm(true);
  }

  async function handleSave(customer: Customer) {
    try {
      setSaving(true);

      const existingCustomer = customers.some(
        (item) => item.id === customer.id
      );

      if (existingCustomer) {
        const updated = await updateCustomer(customer);

        setCustomers((current) =>
          current.map((item) =>
            item.id === updated.id ? updated : item
          )
        );
      } else {
        const created = await createCustomer(customer);

        setCustomers((current) => [created, ...current]);
      }

      setShowForm(false);
      setEditingCustomer(undefined);
    } catch (error) {
      console.error("Customer save error:", error);

      alert(
        "Unable to save the customer. Please check the Supabase database and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(customer: Customer) {
    const customerName =
      `${customer.firstName} ${customer.lastName}`.trim();

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        customerName || "this customer"
      }? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCustomer(customer.id);

      setCustomers((current) =>
        current.filter((item) => item.id !== customer.id)
      );

      if (selectedCustomer?.id === customer.id) {
        setSelectedCustomer(null);
      }
    } catch (error) {
      console.error("Customer delete error:", error);

      alert(
        "Unable to delete the customer. Please try again."
      );
    }
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingCustomer(undefined);
  }

  return (
    <EnterpriseLayout>
      <div className="space-y-8">

        {/* PAGE HEADER */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-700">
              <Users size={16} />
              Customer Relationship Management
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Customers
            </h1>

            <p className="mt-2 max-w-2xl text-slate-500">
              Manage customer relationships, contact information,
              business accounts and customer activity from one
              central workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <Button
              type="button"
              variant="ghost"
              onClick={loadCustomers}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />

              Refresh
            </Button>

            <Button
              type="button"
              onClick={openAddCustomer}
              className="gap-2"
            >
              <Plus size={18} />

              Add Customer
            </Button>

          </div>

        </div>

        {/* KPI CARDS */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

          <Card>
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Customers
                </p>

                <p className="mt-3 text-3xl font-bold text-slate-900">
                  {customers.length}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  All registered customers
                </p>
              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                <Users size={22} />
              </div>

            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active
                </p>

                <p className="mt-3 text-3xl font-bold text-emerald-600">
                  {activeCustomers}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Active customer accounts
                </p>
              </div>

              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                <CheckCircle2 size={22} />
              </div>

            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Inactive
                </p>

                <p className="mt-3 text-3xl font-bold text-slate-700">
                  {inactiveCustomers}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Inactive customer accounts
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
                <Clock3 size={22} />
              </div>

            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Business Accounts
                </p>

                <p className="mt-3 text-3xl font-bold text-violet-600">
                  {businessCustomers}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Customers linked to companies
                </p>
              </div>

              <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
                <Building2 size={22} />
              </div>

            </div>
          </Card>

        </div>

        {/* CUSTOMER WORKSPACE */}

        <Card>
          <div className="space-y-5">

            {/* SEARCH + FILTERS */}

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

              <div className="w-full xl:max-w-xl">
                <SearchBox
                  value={search}
                  onChange={setSearch}
                />
              </div>

              <div className="flex flex-wrap gap-2">

                <button
                  type="button"
                  onClick={() => setViewMode("all")}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    viewMode === "all"
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  All
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("active")}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    viewMode === "active"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Active
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("inactive")}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    viewMode === "inactive"
                      ? "bg-slate-700 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Inactive
                </button>

              </div>

            </div>

            {/* RESULTS SUMMARY */}

            <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Customer Directory
                </p>

                <p className="text-xs text-slate-500">
                  Showing {filteredCustomers.length} of{" "}
                  {customers.length} customers
                </p>
              </div>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  <X size={14} />
                  Clear search
                </button>
              )}

            </div>

            {/* TABLE */}

            <CustomerTable
              customers={filteredCustomers}
              loading={loading}
              onView={setSelectedCustomer}
              onEdit={openEditCustomer}
              onDelete={handleDelete}
            />

          </div>
        </Card>

        {/* CUSTOMER FORM */}

        {showForm && (
          <CustomerForm
            customer={editingCustomer}
            onSave={handleSave}
            onCancel={closeForm}
          />
        )}

        {/* CUSTOMER PROFILE MODAL */}

        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

              {/* PROFILE HEADER */}

              <div className="flex items-start justify-between border-b border-slate-200 p-6">

                <div className="flex items-center gap-4">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-700">
                    {selectedCustomer.firstName
                      ?.charAt(0)
                      ?.toUpperCase()}
                    {selectedCustomer.lastName
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {selectedCustomer.firstName}{" "}
                      {selectedCustomer.lastName}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedCustomer.company ||
                        "Individual Customer"}
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={22} />
                </button>

              </div>

              {/* PROFILE CONTENT */}

              <div className="grid gap-6 p-6 md:grid-cols-2">

                <div className="rounded-2xl border border-slate-200 p-5">

                  <div className="mb-4 flex items-center gap-2">
                    <Mail
                      size={18}
                      className="text-blue-600"
                    />

                    <h3 className="font-semibold text-slate-900">
                      Email
                    </h3>
                  </div>

                  <p className="break-all text-sm text-slate-600">
                    {selectedCustomer.email ||
                      "Not provided"}
                  </p>

                </div>

                <div className="rounded-2xl border border-slate-200 p-5">

                  <div className="mb-4 flex items-center gap-2">
                    <Phone
                      size={18}
                      className="text-blue-600"
                    />

                    <h3 className="font-semibold text-slate-900">
                      Phone
                    </h3>
                  </div>

                  <p className="text-sm text-slate-600">
                    {selectedCustomer.phone ||
                      "Not provided"}
                  </p>

                </div>

                <div className="rounded-2xl border border-slate-200 p-5">

                  <h3 className="mb-4 font-semibold text-slate-900">
                    Location
                  </h3>

                  <p className="text-sm text-slate-600">
                    {selectedCustomer.address ||
                      "Address not provided"}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    {selectedCustomer.city ||
                      "City not provided"}

                    {selectedCustomer.province
                      ? `, ${selectedCustomer.province}`
                      : ""}
                  </p>

                </div>

                <div className="rounded-2xl border border-slate-200 p-5">

                  <h3 className="mb-4 font-semibold text-slate-900">
                    Account Status
                  </h3>

                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
                      selectedCustomer.status ===
                      "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {selectedCustomer.status}
                  </span>

                </div>

                <div className="rounded-2xl border border-slate-200 p-5 md:col-span-2">

                  <h3 className="mb-4 font-semibold text-slate-900">
                    Notes
                  </h3>

                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                    {selectedCustomer.notes ||
                      "No notes have been recorded for this customer."}
                  </p>

                </div>

              </div>

              {/* PROFILE ACTIONS */}

              <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-6 sm:flex-row sm:justify-end">

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setSelectedCustomer(null)
                  }
                >
                  Close
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    openEditCustomer(
                      selectedCustomer
                    );
                    setSelectedCustomer(null);
                  }}
                >
                  Edit Customer
                </Button>

              </div>

            </div>

          </div>
        )}

      </div>
    </EnterpriseLayout>
  );
}