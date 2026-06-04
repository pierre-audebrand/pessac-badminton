import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
  bordered?: boolean;
}

export function PageSection({
  title,
  children,
  className,
  bordered = true,
}: PageSectionProps) {
  return (
    <section className="space-y-3">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}

      <div
        className={cn(bordered && "min-w-0 rounded-lg border p-4", className)}
      >
        {children}
      </div>
    </section>
  );
}
