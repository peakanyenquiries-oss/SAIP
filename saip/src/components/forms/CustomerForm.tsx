"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  User,
  X,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Customer } from "@/types/customer";

interface CustomerFormProps {
  customer?: Customer;
  onSave: (customer: Customer) => Promise<void> | void;
  onCancel: () => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  notes: string;
  status: "Active" | "Inactive";
}

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  province: "",
  notes: "",
  status: "Active",
};

const provinces = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];

export default function CustomerForm({
  customer,
  onSave,
  onCancel,
}: CustomerFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState("");

  const editing = Boolean(customer);

  useEffect(() => {
    if (!customer) {
      setForm(emptyForm);
      setValidationError("");
      return;
    }

    setForm({
      firstName: customer.firstName ?? "",
      lastName: customer.lastName ?? "",
      company: customer.company ?? "",
      email: customer.email ?? "",
      phone: customer.phone ?? "",
      address: customer.address ?? "",
      city: customer.city ?? "",
      province: customer.province ?? "",
      notes: customer.notes ?? "",
      status:
        customer.status === "Inactive"
          ? "Inactive"
          : "Active",
    });

    setValidationError("");
  }, [customer]);

  function updateField(
    field: keyof FormState,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setValidationError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setValidationError("");

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();

    if (!firstName) {
      setValidationError(
        "Please enter the customer's first name."
      );
      return;
    }

    if (!lastName) {
      setValidationError(
        "Please enter the customer's last name."
      );
      return;
    }

    try {
      setSaving(true);

      const now = new Date().toISOString();

      const customerData: Customer = {
        id: customer?.id ?? crypto.randomUUID(),

        firstName,
        lastName,
        company: form.company.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        province: form.province,
        notes: form.notes.trim(),
        status: form.status,

        createdAt: customer?.createdAt ?? now,
        updatedAt: now,
      };

      await onSave(customerData);
    } catch (error) {
      console.error("Customer form error:", error);

      setValidationError(
        "Unable to save the customer. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
              <User size={16} />
              Customer Management
            </div>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {editing ? "Edit Customer" : "Add Customer"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editing
                ? "Update the customer's information below."
                : "Create a new customer account in SAIP."}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={22} />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-8 p-6"
        >

          {validationError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {validationError}
            </div>
          )}

          {/* PERSONAL INFORMATION */}

          <section>

            <div className="mb-5 flex items-center gap-3">

              <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
                <User size={18} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Personal Information
                </h3>

                <p className="text-xs text-slate-500">
                  Basic customer identification details.
                </p>
              </div>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <Input
                label="First Name *"
                value={form.firstName}
                onChange={(event) =>
                  updateField(
                    "firstName",
                    event.target.value
                  )
                }
                placeholder="e.g. John"
              />

              <Input
                label="Last Name *"
                value={form.lastName}
                onChange={(event) =>
                  updateField(
                    "lastName",
                    event.target.value
                  )
                }
                placeholder="e.g. Smith"
              />

            </div>

          </section>

          {/* BUSINESS INFORMATION */}

          <section>

            <div className="mb-5 flex items-center gap-3">

              <div className="rounded-xl bg-violet-100 p-2 text-violet-700">
                <Building2 size={18} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Business Information
                </h3>

                <p className="text-xs text-slate-500">
                  Optional company and business account details.
                </p>
              </div>

            </div>

            <Input
              label="Company / Organisation"
              value={form.company}
              onChange={(event) =>
                updateField(
                  "company",
                  event.target.value
                )
              }
              placeholder="e.g. ABC Trading"
            />

          </section>

          {/* CONTACT INFORMATION */}

          <section>

            <div className="mb-5 flex items-center gap-3">

              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                <Phone size={18} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Contact Information
                </h3>

                <p className="text-xs text-slate-500">
                  Customer communication details.
                </p>
              </div>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div className="relative">

                <Mail
                  size={17}
                  className="absolute left-4 top-[42px] text-slate-400"
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="customer@example.com"
                  className="pl-11"
                />

              </div>

              <div className="relative">

                <Phone
                  size={17}
                  className="absolute left-4 top-[42px] text-slate-400"
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value
                    )
                  }
                  placeholder="e.g. 071 234 5678"
                  className="pl-11"
                />

              </div>

            </div>

          </section>

          {/* ADDRESS */}

          <section>

            <div className="mb-5 flex items-center gap-3">

              <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
                <MapPin size={18} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Address & Location
                </h3>

                <p className="text-xs text-slate-500">
                  Customer location and address information.
                </p>
              </div>

            </div>

            <div className="space-y-5">

              <Input
                label="Street Address"
                value={form.address}
                onChange={(event) =>
                  updateField(
                    "address",
                    event.target.value
                  )
                }
                placeholder="Street name and number"
              />

              <div className="grid gap-5 md:grid-cols-2">

                <Input
                  label="City / Town"
                  value={form.city}
                  onChange={(event) =>
                    updateField(
                      "city",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Phalaborwa"
                />

                <div className="space-y-2">

                  <label className="text-sm font-medium text-slate-700">
                    Province
                  </label>

                  <select
                    value={form.province}
                    onChange={(event) =>
                      updateField(
                        "province",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">
                      Select province
                    </option>

                    {provinces.map((province) => (
                      <option
                        key={province}
                        value={province}
                      >
                        {province}
                      </option>
                    ))}
                  </select>

                </div>

              </div>

            </div>

          </section>

          {/* ACCOUNT SETTINGS */}

          <section>

            <div className="mb-5">

              <h3 className="font-semibold text-slate-900">
                Account Settings
              </h3>

              <p className="text-xs text-slate-500">
                Control the customer's current account status.
              </p>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div className="space-y-2">

                <label className="text-sm font-medium text-slate-700">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>

            </div>

          </section>

          {/* NOTES */}

          <section>

            <div className="mb-4">

              <h3 className="font-semibold text-slate-900">
                Notes
              </h3>

              <p className="text-xs text-slate-500">
                Add any useful information about this customer.
              </p>

            </div>

            <textarea
              value={form.notes}
              onChange={(event) =>
                updateField(
                  "notes",
                  event.target.value
                )
              }
              rows={5}
              placeholder="Customer notes..."
              className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            />

          </section>

          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={saving}
              disabled={saving}
            >
              {editing
                ? "Save Changes"
                : "Create Customer"}
            </Button>

          </div>

        </form>

      </div>

    </div>
  );
}