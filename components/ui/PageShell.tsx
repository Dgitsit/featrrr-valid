import { ReactNode } from "react";
import clsx from "clsx";

export default function PageShell({
  children,
  className,
  narrow = false,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div className={clsx("px-5 py-8 sm:px-6 sm:py-12 lg:px-8", className)}>
      <div className={clsx("mx-auto w-full", narrow ? "max-w-3xl" : "max-w-7xl")}>
        {children}
      </div>
    </div>
  );
}
