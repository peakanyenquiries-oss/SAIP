"use client";

import {
  Clock3,
  Package,
  Pencil,
} from "lucide-react";

export interface ProductHistoryItem {

  id: string;

  title: string;

  description: string;

  date: string;

  type:
    | "created"
    | "updated"
    | "stock";

}

interface Props {

  history: ProductHistoryItem[];

}

export default function ProductHistory({
  history,
}: Props) {

  if (history.length === 0) {

    return (

      <div className="rounded-2xl border bg-white p-6">

        <p className="text-slate-500">

          No history available.

        </p>

      </div>

    );

  }

  return (

    <div className="rounded-2xl border bg-white">

      <div className="border-b p-5">

        <h2 className="text-lg font-semibold">

          Product History

        </h2>

      </div>

      <div>

        {history.map(item => (

          <div
            key={item.id}
            className="flex gap-4 border-b p-5 last:border-0"
          >

            <div>

              {item.type === "created" && (

                <Package
                  size={22}
                  className="text-green-600"
                />

              )}

              {item.type === "updated" && (

                <Pencil
                  size={22}
                  className="text-blue-600"
                />

              )}

              {item.type === "stock" && (

                <Clock3
                  size={22}
                  className="text-amber-600"
                />

              )}

            </div>

            <div className="flex-1">

              <h3 className="font-semibold">

                {item.title}

              </h3>

              <p className="mt-1 text-sm text-slate-600">

                {item.description}

              </p>

              <p className="mt-2 text-xs text-slate-400">

                {item.date}

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}