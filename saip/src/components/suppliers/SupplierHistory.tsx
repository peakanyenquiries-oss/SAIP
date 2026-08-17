"use client";

import {
  Calendar,
  CheckCircle,
  Edit,
  FileText,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";

import Card from "@/components/ui/Card";

export interface SupplierHistoryItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type:
    | "created"
    | "updated"
    | "approved"
    | "document"
    | "audit";
}

interface SupplierHistoryProps {
  history: SupplierHistoryItem[];
}

function HistoryIcon({
  type,
}: {
  type: SupplierHistoryItem["type"];
}) {
  switch (type) {
    case "created":
      return (
        <PlusCircle
          size={20}
          className="text-green-600"
        />
      );

    case "updated":
      return (
        <Edit
          size={20}
          className="text-blue-600"
        />
      );

    case "approved":
      return (
        <CheckCircle
          size={20}
          className="text-emerald-600"
        />
      );

    case "document":
      return (
        <FileText
          size={20}
          className="text-amber-600"
        />
      );

    default:
      return (
        <ShieldCheck
          size={20}
          className="text-purple-600"
        />
      );
  }
}

export default function SupplierHistory({
  history,
}: SupplierHistoryProps) {
  return (
    <Card>

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            Activity History
          </h2>

          <p className="text-slate-500">
            Complete supplier audit trail.
          </p>

        </div>

      </div>

      {history.length === 0 ? (

        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">

          <Calendar
            size={40}
            className="mx-auto mb-4 text-slate-400"
          />

          <h3 className="text-lg font-semibold text-slate-700">
            No Activity Yet
          </h3>

          <p className="mt-2 text-slate-500">
            Supplier events will appear here.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {history.map((item) => (

            <div
              key={item.id}
              className="flex gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-slate-50"
            >

              <div className="mt-1">

                <HistoryIcon
                  type={item.type}
                />

              </div>

              <div className="flex-1">

                <h3 className="font-semibold text-slate-800">
                  {item.title}
                </h3>

                <p className="mt-1 text-slate-600">
                  {item.description}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  {item.date}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </Card>
  );
}