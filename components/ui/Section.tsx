import { ReactNode } from "react";
import clsx from "clsx";

export default function Section({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("py-10 sm:py-14 lg:py-20", className)}>
      {children}
    </section>
  );
}
