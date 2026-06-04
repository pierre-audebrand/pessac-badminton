"use client";

import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { ConfirmationSuppression } from "@/components/ui/confirmation-suppression";

interface EntityDeleteActionProps {
  titre: string;
  description: string;
  formAction: string | ((formData: FormData) => void | Promise<void>);
  disabled?: boolean;
  label?: string;
  children?: ReactNode;
}

export function EntityDeleteAction({
  titre,
  description,
  formAction,
  disabled,
  label = "Supprimer",
  children,
}: EntityDeleteActionProps) {
  return (
    <ConfirmationSuppression titre={titre} description={description}>
      <form action={formAction}>
        <Button
          type="submit"
          variant="destructive"
          size="sm"
          disabled={disabled}
        >
          {children ?? label}
        </Button>
      </form>
    </ConfirmationSuppression>
  );
}
