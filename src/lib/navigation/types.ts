import type { LucideIcon } from "lucide-react";

export type MenuItem = {
  href?: string;
  libelle: string;
  icon?: LucideIcon;
  enfants?: MenuItem[];
};
