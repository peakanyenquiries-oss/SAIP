"use client";

import { Bell, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info";
  createdAt: string;
  read: boolean;
}

export default function NotificationCenter() {

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([
      {
        id: "1",
        title: "Welcome to SAIP",
        message:
          "Your enterprise platform is ready.",
        type: "success",
        createdAt: new Date().toISOString(),
        read: false,
      },
    ]);

  function markAsRead(id: string) {

    setNotifications((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              read: true,
            }
          : item
      )
    );

  }

  function clearAll() {

    setNotifications([]);

  }

  function icon(type: NotificationItem["type"]) {

    switch (type) {

      case "success":
        return (
          <CheckCircle2
            size={20}
            className="text-green-600"
          />
        );

      case "warning":
        return (
          <AlertTriangle
            size={20}
            className="text-amber-600"
          />
        );

      default:
        return (
          <Info
            size={20}
            className="text-blue-600"
          />
        );

    }

  }

  return (

    <div className="rounded-2xl border bg-white shadow-sm">

      <div className="flex items-center justify-between border-b p-5">

        <div className="flex items-center gap-3">

          <Bell size={22} />

          <h2 className="text-lg font-semibold">
            Notifications
          </h2>

        </div>

        <button
          onClick={clearAll}
          className="text-sm text-red-600 hover:underline"
        >
          Clear All
        </button>

      </div>

      {notifications.length === 0 ? (

        <div className="p-8 text-center text-slate-500">

          No notifications.

        </div>

      ) : (

        <div>

          {notifications.map((notification) => (

            <button
              key={notification.id}
              onClick={() =>
                markAsRead(notification.id)
              }
              className={`flex w-full items-start gap-4 border-b p-5 text-left transition hover:bg-slate-50 ${
                notification.read
                  ? "opacity-60"
                  : ""
              }`}
            >

              {icon(notification.type)}

              <div className="flex-1">

                <h3 className="font-semibold">

                  {notification.title}

                </h3>

                <p className="mt-1 text-sm text-slate-600">

                  {notification.message}

                </p>

                <p className="mt-2 text-xs text-slate-400">

                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}

                </p>

              </div>

            </button>

          ))}

        </div>

      )}

    </div>

  );

}