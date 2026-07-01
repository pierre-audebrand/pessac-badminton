import {
  Home,
  Newspaper,
  Mail,
  CalendarDays,
  Users,
  FileText,
  Info,
  ShieldCheck,
  Building2,
  Handshake,
  Euro,
  FileBadge,
  Shield,
  UsersRound,
  Key,
  CalendarX2,
  ListTree,
} from "lucide-react";

import { Routes } from "@/lib/routes";
import { MenuItem } from "./types";

export const menuSite: MenuItem[] = [
  {
    href: Routes.ACCUEIL,
    libelle: "Accueil",
    icon: Home,
  },
  {
    libelle: "Le club",
    icon: Users,
    enfants: [
      {
        href: Routes.CLUB_PRESENTATION,
        libelle: "Présentation",
        icon: Info,
      },
      {
        href: Routes.CLUB_BUREAU,
        libelle: "Le bureau",
        icon: ShieldCheck,
      },
      {
        href: Routes.CLUB_SALLES,
        libelle: "Les salles",
        icon: Building2,
      },
      {
        href: Routes.CLUB_PARTENAIRES,
        libelle: "Nos partenaires",
        icon: Handshake,
      },
    ],
  },
  {
    href: Routes.CRENEAUX,
    libelle: "Créneaux",
    icon: CalendarDays,
  },
  {
    libelle: "Inscription",
    icon: FileText,
    enfants: [
      {
        href: Routes.TARIFS,
        libelle: "Tarifs",
        icon: Euro,
      },
      {
        href: Routes.DOCUMENTS_INSCRIPTION,
        libelle: "Documents d'inscription",
        icon: FileText,
      },
      {
        href: Routes.REGLEMENT_INTERIEUR,
        libelle: "Règlement intérieur",
        icon: FileBadge,
      },
    ],
  },
  {
    href: Routes.ACTUALITES,
    libelle: "Actualités",
    icon: Newspaper,
  },
  {
    href: Routes.CONTACT,
    libelle: "Contact",
    icon: Mail,
  },
];

export const menuGestion: MenuItem[] = [
  {
    href: Routes.GESTION_UTILISATEURS,
    libelle: "Utilisateurs",
    icon: Users,
  },
  {
    href: Routes.GESTION_ROLES,
    libelle: "Rôles",
    icon: Shield,
  },
  {
    href: Routes.GESTION_PERMISSIONS,
    libelle: "Permissions",
    icon: Key,
  },
  {
    href: Routes.GESTION_GROUPES,
    libelle: "Groupes",
    icon: UsersRound,
  },
  {
    href: Routes.GESTION_SALLES,
    libelle: "Salles",
    icon: Building2,
  },
  {
    href: Routes.GESTION_CRENEAUX,
    libelle: "Créneaux",
    icon: CalendarDays,
  },
  {
    href: Routes.GESTION_INDISPONIBILITES,
    libelle: "Indisponibilités",
    icon: CalendarX2,
  },
  {
    href: Routes.GESTION_PAGES,
    libelle: "Pages",
    icon: FileText,
  },
  {
    href: Routes.GESTION_MENU_ITEMS,
    libelle: "Menus",
    icon: ListTree,
  },
];
