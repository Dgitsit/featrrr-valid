import { HTMLAttributes } from "react";
import clsx from "clsx";

export default function GradientText({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={clsx("text-brand-gradient", className)} {...props}>
      {children}
    </span>
  );
}
