"use client";

import Link from "next/link";

import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EntityViewActionProps {
  href: string;
}

export function EntityViewAction({ href }: EntityViewActionProps) {
  return (
    <Button asChild size="sm" variant="outline">
      <Link href={href} aria-label="Consulter" title="Consulter">
        <Eye className="h-4 w-4" />
      </Link>
    </Button>
  );
}
