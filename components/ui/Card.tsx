"use client";

import { HTMLAttributes } from "react";
import clsx from "clsx";

type CardVariant = "default" | "elevated" | "soft";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export default function Card({
  children,
  className,
  variant = "default",
  ...props
}: CardProps) {
  const variants = {
    default: "glass-panel",
    elevated:
      "border border-white/10 bg-[#0f0f18]/90 shadow-2xl shadow-black/40",
    soft: "border border-white/10 bg-white/[0.045]",
  };

  return (
    <div
      className={clsx("rounded-2xl p-5 sm:p-6", variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
