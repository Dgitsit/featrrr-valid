"use client";

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  full?: boolean;
  loading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  full = false,
  loading = false,
  className,
  disabled,
  ...props
}: Props) {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold tracking-tight transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:ring-offset-2 focus:ring-offset-black disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55 active:scale-[0.98]";

  const variants = {
    primary:
      "brand-gradient text-white shadow-lg shadow-purple-950/30 hover:-translate-y-0.5 hover:shadow-orange-500/20",
    secondary:
      "border border-white/10 bg-white/[0.06] text-white shadow-sm hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.1]",
    ghost:
      "text-zinc-300 hover:bg-white/[0.06] hover:text-white",
    danger:
      "border border-red-400/20 bg-red-500/12 text-red-100 hover:border-red-400/40 hover:bg-red-500/20",
  };

  return (
    <button
      className={clsx(
        base,
        variants[variant],
        full && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}