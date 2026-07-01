import { badgeVariants } from "@/components/ui/badge";
import { Menu } from "@prisma/client";
import { VariantProps } from "class-variance-authority";
import { LucideIcon, PanelBottom, PanelTop } from "lucide-react";

export interface MenuMetadata {
  label: string;
  icon: LucideIcon;
  variant?: VariantProps<typeof badgeVariants>["variant"];
}

const menuMetadata: Record<Menu, MenuMetadata> = {
  [Menu.EN_TETE]: {
    label: "Menu d'en-tête",
    icon: PanelTop,
  },

  [Menu.PIED_DE_PAGE]: {
    label: "Menu de pied de page",
    icon: PanelBottom,
    variant: "secondary",
  },
};

export function recupererMenuData(menu: Menu): MenuMetadata {
  return menuMetadata[menu];
}

export function libelleMenu(menu: Menu): string {
  return menuMetadata[menu].label;
}

export function iconeMenu(menu: Menu): LucideIcon {
  return menuMetadata[menu].icon;
}

export function variantMenu(
  menu: Menu,
): VariantProps<typeof badgeVariants>["variant"] {
  return menuMetadata[menu].variant;
}
