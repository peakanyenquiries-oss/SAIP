"use client";

import { useState } from "react";

import { NotificationItem } from "@/components/notifications/NotificationCenter";

export default function useNotifications() {

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  function notify(
    title: string,
    message: string,
    type: NotificationItem["type"] = "info"
  ) {

    const notification: NotificationItem = {

      id: crypto.randomUUID(),

      title,

      message,

      type,

      createdAt:
        new Date().toISOString(),

      read: false,

    };

    setNotifications((items) => [

      notification,

      ...items,

    ]);

  }

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

  function remove(id: string) {

    setNotifications((items) =>

      items.filter(

        item => item.id !== id

      )

    );

  }

  function clear() {

    setNotifications([]);

  }

  return {

    notifications,

    notify,

    markAsRead,

    remove,

    clear,

  };

}