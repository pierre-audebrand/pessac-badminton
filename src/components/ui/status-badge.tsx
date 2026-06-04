import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  label: string;

  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function StatusBadge({
  label,
  variant = "secondary",
}: StatusBadgeProps) {
  return <Badge variant={variant}>{label}</Badge>;
}

interface BooleanStatusBadgeProps {
  value: boolean;

  trueLabel: string;

  falseLabel: string;
}

export function BooleanStatusBadge({
  value,
  trueLabel,
  falseLabel,
}: BooleanStatusBadgeProps) {
  return (
    <StatusBadge
      label={value ? trueLabel : falseLabel}
      variant={value ? "default" : "secondary"}
    />
  );
}

interface SeoBadgeProps {
  seoTitre: string | null;

  seoDescription: string | null;
}

export function SeoBadge({ seoTitre, seoDescription }: SeoBadgeProps) {
  const complet = !!seoTitre && !!seoDescription;

  return (
    <StatusBadge
      label={complet ? "Complet" : "À compléter"}
      variant={complet ? "default" : "secondary"}
    />
  );
}
