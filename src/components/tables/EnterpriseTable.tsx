"use client";

import { ReactNode } from "react";

export interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: string;
  render?: (row: T) => ReactNode;
}

interface EnterpriseTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function EnterpriseTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "No records found.",
}: EnterpriseTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-100">

            <tr>

              {columns.map((column) => (

                <th
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className="border-b border-slate-200 px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-slate-600"
                >
                  {column.title}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {loading ? (

              [...Array(8)].map((_, index) => (

                <tr key={index}>

                  {columns.map((column) => (

                    <td
                      key={String(column.key)}
                      className="border-b border-slate-100 px-6 py-5"
                    >
                      <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
                    </td>

                  ))}

                </tr>

              ))

            ) : data.length === 0 ? (

              <tr>

                <td
                  colSpan={columns.length}
                  className="py-20 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>

              </tr>

            ) : (

              data.map((row, index) => (

                <tr
                  key={index}
                  className="transition hover:bg-blue-50"
                >

                  {columns.map((column) => (

                    <td
                      key={String(column.key)}
                      className="border-b border-slate-100 px-6 py-5 text-sm text-slate-700"
                    >
                      {column.render
                        ? column.render(row)
                        : String(
                            row[column.key as keyof T] ?? ""
                          )}
                    </td>

                  ))}

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}