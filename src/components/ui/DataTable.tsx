"use client";

import { ReactNode } from "react";
import Card from "./Card";

export interface Column<T> {
  title: string;
  render: (row: T) => ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  loading?: boolean;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T>({
  columns,
  data,
  emptyMessage = "No records found.",
  loading = false,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <Card className="overflow-hidden p-0">

      <div className="overflow-x-auto">

        <table className="min-w-full border-collapse">

          <thead className="bg-slate-100">

            <tr>

              {columns.map((column, index) => (

                <th
                  key={index}
                  style={{ width: column.width }}
                  className={`
                    px-6
                    py-4
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-600
                    ${
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                        ? "text-right"
                        : "text-left"
                    }
                  `}
                >
                  {column.title}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-slate-500"
                >
                  Loading...
                </td>

              </tr>

            ) : data.length === 0 ? (

              <tr>

                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>

              </tr>

            ) : (

              data.map((row, rowIndex) => (

                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    border-t
                    transition-colors
                    hover:bg-slate-50
                    ${
                      onRowClick
                        ? "cursor-pointer"
                        : ""
                    }
                  `}
                >

                  {columns.map((column, columnIndex) => (

                    <td
                      key={columnIndex}
                      className={`
                        px-6
                        py-4
                        ${
                          column.align === "center"
                            ? "text-center"
                            : column.align === "right"
                            ? "text-right"
                            : "text-left"
                        }
                      `}
                    >
                      {column.render(row)}
                    </td>

                  ))}

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </Card>
  );
}