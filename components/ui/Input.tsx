"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import clsx from "clsx";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-sky-400/60 focus:bg-black/40 focus:ring-2 focus:ring-sky-400/15 disabled:cursor-not-allowed disabled:opacity-60";

export default function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx(inputClass, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={clsx(inputClass, "resize-none", className)} {...props} />;
}
