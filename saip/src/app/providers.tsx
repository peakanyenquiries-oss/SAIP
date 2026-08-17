"use client";

import { ReactNode } from "react";

import { NotificationProvider } from "@/context/NotificationContext";

interface Props {
  children: ReactNode;
}

export default function Providers({
  children,
}: Props) {

  return (

    <NotificationProvider>

      {children}

    </NotificationProvider>

  );

}