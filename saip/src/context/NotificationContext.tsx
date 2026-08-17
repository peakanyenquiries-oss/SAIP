"use client";

import {
  createContext,
  useContext,
  useMemo,
  ReactNode,
} from "react";

import useNotifications from "@/hooks/useNotifications";

type NotificationContextType =
  ReturnType<typeof useNotifications>;

const NotificationContext =
  createContext<
    NotificationContextType | undefined
  >(undefined);

interface Props {
  children: ReactNode;
}

export function NotificationProvider({
  children,
}: Props) {

  const notificationSystem =
    useNotifications();

  const value =
    useMemo(
      () => notificationSystem,
      [notificationSystem]
    );

  return (

    <NotificationContext.Provider
      value={value}
    >

      {children}

    </NotificationContext.Provider>

  );

}

export function useNotificationCenter() {

  const context =
    useContext(
      NotificationContext
    );

  if (!context) {

    throw new Error(
      "useNotificationCenter must be used inside NotificationProvider."
    );

  }

  return context;

}