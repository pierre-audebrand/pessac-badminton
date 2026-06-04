"use client";

import { CircleCheck, CircleOff, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  active: boolean;

  activateAction: () => Promise<void>;
  deactivateAction: () => Promise<void>;

  activateLabel?: string;
  deactivateLabel?: string;

  activateVariant?: "default" | "success" | "secondary" | "outline" | "ghost";
  deactivateVariant?:
    | "default"
    | "destructive"
    | "secondary"
    | "outline"
    | "ghost";

  activateIcon?: LucideIcon;
  deactivateIcon?: LucideIcon;
}

export function EntityToggleAction({
  active,
  activateAction,
  deactivateAction,
  activateLabel = "Activer",
  deactivateLabel = "Désactiver",
  activateVariant = "success",
  deactivateVariant = "destructive",
  activateIcon: ActivateIcon = CircleCheck,
  deactivateIcon: DeactivateIcon = CircleOff,
}: Props) {
  if (active) {
    return (
      <form action={deactivateAction}>
        <Button
          type="submit"
          size="sm"
          variant={deactivateVariant}
          aria-label={deactivateLabel}
          title={deactivateLabel}
        >
          <DeactivateIcon className="h-4 w-4" />
        </Button>
      </form>
    );
  }

  return (
    <form action={activateAction}>
      <Button
        type="submit"
        size="sm"
        variant={activateVariant}
        aria-label={activateLabel}
        title={activateLabel}
      >
        <ActivateIcon className="h-4 w-4" />
      </Button>
    </form>
  );
}
