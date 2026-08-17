import type { Metadata } from "next";
import "./globals.css";

import Providers from "./providers";
import AppLayout from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "SAIP Enterprise",
  description:
    "South African Automotive Intelligence Platform",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {

  return (

    <html lang="en">

      <body>

        <Providers>

          <AppLayout>

            {children}

          </AppLayout>

        </Providers>

      </body>

    </html>

  );

}