"use client";

import { Routes } from "@/lib/routes";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigationMenuLinkStyle } from "@/components/ui/navigation-menu";

export function BoutonDeconnexion() {
  return (
    <Button
      variant="destructive"
      onClick={() =>
        signOut({
          callbackUrl: Routes.ACCUEIL,
        })
      }
    >
      <LogOut className="h-4 w-4" />
      Déconnexion
    </Button>
  );
}

export function BoutonDeconnexionMenu() {
  return (
    <button
      type="button"
      onClick={() =>
        signOut({
          callbackUrl: Routes.ACCUEIL,
        })
      }
      className={cn(navigationMenuLinkStyle, "w-full justify-start")}
    >
      <LogOut className="h-4 w-4" />
      Déconnexion
    </button>
  );
}

export function BoutonDeconnexionMenuMobile() {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-muted"
      onClick={() =>
        signOut({
          callbackUrl: Routes.ACCUEIL,
        })
      }
    >
      <LogOut className="h-4 w-4" />
      Déconnexion
    </button>
  );
}
