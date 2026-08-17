"use client";

import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
 Award,
  CheckCircle,
  Clock3,
  XCircle,
} from "lucide-react";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { Supplier } from "@/types/supplier";

interface SupplierProfileProps {
  supplier: Supplier;
}

export default function SupplierProfile({
  supplier,
}: SupplierProfileProps) {
  function StatusBadge() {
    switch (supplier.status) {
      case "Active":
        return (
          <Badge
            text="Active"
            color="green"
          />
        );

      case "Pending":
        return (
          <Badge
            text="Pending"
            color="yellow"
          />
        );

      default:
        return (
          <Badge
            text="Inactive"
            color="red"
          />
        );
    }
  }

  function StatusIcon() {
    switch (supplier.status) {
      case "Active":
        return (
          <CheckCircle
            size={22}
            className="text-green-600"
          />
        );

      case "Pending":
        return (
          <Clock3
            size={22}
            className="text-amber-500"
          />
        );

      default:
        return (
          <XCircle
            size={22}
            className="text-red-600"
          />
        );
    }
  }

  return (
    <Card className="space-y-8">

      <div className="flex items-center justify-between border-b pb-6">

        <div>

          <h2 className="text-3xl font-bold text-slate-800">
            {supplier.company}
          </h2>

          <p className="mt-2 text-slate-500">
            Supplier Profile
          </p>

        </div>

        <div className="flex items-center gap-3">

          {StatusIcon()}

          <StatusBadge />

        </div>

      </div>

      <div className="grid gap-8 lg:grid-cols-2">

        <div className="space-y-5">

          <div className="flex items-center gap-3">

            <Building2
              size={20}
              className="text-blue-600"
            />

            <div>

              <p className="text-sm text-slate-500">
                Company
              </p>

              <p className="font-semibold">
                {supplier.company}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <User
              size={20}
              className="text-blue-600"
            />

            <div>

              <p className="text-sm text-slate-500">
                Contact Person
              </p>

              <p className="font-semibold">
                {supplier.contactPerson}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <Mail
              size={20}
              className="text-blue-600"
            />

            <div>

              <p className="text-sm text-slate-500">
                Email
              </p>

              <p className="font-semibold">
                {supplier.email}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <Phone
              size={20}
              className="text-blue-600"
            />

            <div>

              <p className="text-sm text-slate-500">
                Phone
              </p>

              <p className="font-semibold">
                {supplier.phone}
              </p>

            </div>

          </div>

        </div>

        <div className="space-y-5">

          <div className="flex items-center gap-3">

            <MapPin
              size={20}
              className="text-blue-600"
            />

            <div>

              <p className="text-sm text-slate-500">
                Province
              </p>

              <p className="font-semibold">
                {supplier.province}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <CreditCard
              size={20}
              className="text-blue-600"
            />

            <div>

              <p className="text-sm text-slate-500">
                Payment Terms
              </p>

              <p className="font-semibold">
                {supplier.paymentTerms}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <Award
              size={20}
              className="text-blue-600"
            />

            <div>

              <p className="text-sm text-slate-500">
                Supplier Score
              </p>

              <p className="text-xl font-bold text-blue-700">
                {supplier.supplierScore}/100
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <Calendar
              size={20}
              className="text-blue-600"
            />

            <div>

              <p className="text-sm text-slate-500">
                Created
              </p>

              <p className="font-semibold">
                {new Date(
                  supplier.createdAt
                ).toLocaleDateString()}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <Calendar
              size={20}
              className="text-blue-600"
            />

            <div>

              <p className="text-sm text-slate-500">
                Last Updated
              </p>

              <p className="font-semibold">
                {new Date(
                  supplier.updatedAt
                ).toLocaleDateString()}
              </p>

            </div>

          </div>

        </div>

      </div>

    </Card>
  );
}