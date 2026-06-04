"use client";

import Link from "next/link";

import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EntityEditActionProps {
  href: string;
}

export function EntityEditAction({ href }: EntityEditActionProps) {
  return (
    <Button asChild size="sm" variant="outline">
      <Link href={href} aria-label="Modifier" title="Modifier">
        <Pencil className="h-4 w-4" />
      </Link>
    </Button>
  );
}
