"use client";

import Link from "next/link";

import { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  href: string;

  icon: LucideIcon;

  label: string;

  variant?: "default" | "secondary" | "outline" | "ghost";

  size?: "sm" | "default" | "lg" | "icon";
}

export function EntityCustomAction({
  href,
  icon: Icon,
  label,
  variant = "outline",
  size = "sm",
}: Props) {
  return (
    <Button asChild variant={variant} size={size}>
      <Link href={href} aria-label={label} title={label}>
        <Icon className="h-4 w-4" />
      </Link>
    </Button>
  );
}
