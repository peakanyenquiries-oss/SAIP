"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import Button from "./Button";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  width?: "sm" | "md" | "lg" | "xl" | "full";
}

export default function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  width = "lg",
}: ModalProps) {

  useEffect(() => {

    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {

      if (event.key === "Escape") {
        onClose();
      }

    };

    document.addEventListener("keydown", handleEscape);

    document.body.style.overflow = "hidden";

    return () => {

      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow = "auto";

    };

  }, [open, onClose]);

  if (!open) return null;

  const widths = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-7xl",
  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div
        className={`
          w-full
          ${widths[width]}
          rounded-2xl
          bg-white
          shadow-2xl
        `}
      >

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-xl font-semibold text-slate-800">
            {title}
          </h2>

          <Button
            variant="ghost"
            onClick={onClose}
          >
            <X size={18} />
          </Button>

        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">

          {children}

        </div>

        {footer && (

          <div className="border-t bg-slate-50 px-6 py-4">

            {footer}

          </div>

        )}

      </div>

    </div>

  );

}