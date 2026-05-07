"use client";

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  full?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  full = false,
  className,
  ...props
}: Props) {
  const base =
    "px-5 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-purple-500 to-orange-400 text-white hover:opacity-90 shadow-md",
    secondary:
      "border border-gray-600 text-white hover:bg-gray-800",
    ghost:
      "text-gray-400 hover:text-white",
    danger:
      "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      className={clsx(
        base,
        variants[variant],
        full && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}