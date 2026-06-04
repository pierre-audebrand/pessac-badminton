import Link from "next/link";
import { ReactNode } from "react";

interface PageCardLinkProps {
  href: string;
  children: ReactNode;
}

export function PageCardLink({ href, children }: PageCardLinkProps) {
  return (
    <Link
      href={href}
      className="block rounded-lg border p-4 transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {children}
    </Link>
  );
}
