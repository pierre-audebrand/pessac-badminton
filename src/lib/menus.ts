import { badgeVariants } from "@/components/ui/badge";
import { Menu } from "@prisma/client";
import { VariantProps } from "class-variance-authority";

export interface MenuMetadata {
  libelle: string;
  variant?: VariantProps<typeof badgeVariants>["variant"];
}

export const menus: Record<Menu, MenuMetadata> = {
  [Menu.EN_TETE]: {
    libelle: "Menu d'en-tête",
  },

  [Menu.PIED_DE_PAGE]: {
    libelle: "Menu de pied de page",
    variant: "secondary",
  },
};

export function libelleMenu(menu: Menu): string {
  return menus[menu].libelle;
}

export function lireMenuQuery(menu: string | undefined): Menu {
  return Object.values(Menu).includes(menu as Menu)
    ? (menu as Menu)
    : Menu.EN_TETE;
}
