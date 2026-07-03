"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { exigerPermission } from "@/lib/autorisations";
import {
  ajouterErreursZod,
  construireErreur,
  construireErreurException,
  FormState,
} from "@/lib/formulaire";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import {
  creerMenuItemSchema,
  modifierMenuItemSchema,
} from "@/schemas/menu-item.schemas";

import {
  creerMenuItem,
  modifierMenuItem,
  supprimerMenuItem,
  modifierActivationMenuItem,
  ParentDansUnAutreMenuError,
  ParentInvalideError,
  ParentNonAutoriseError,
  PageDejaUtiliseeDansMenuError,
  MenuItemPossedeDesEnfantsError,
} from "@/services/menu-item.service";

import { reordonnerMenuItems } from "@/services/menu-item.service";

export type MenuItemFormState = FormState<
  | "menu"
  | "parentId"
  | "libelle"
  | "type"
  | "pageId"
  | "url"
  | "ordre"
  | "nouvelOnglet"
  | "actif"
>;

export async function creerMenuItemAction(
  _state: MenuItemFormState,
  formData: FormData,
): Promise<MenuItemFormState> {
  await exigerPermission(Permissions.MENUS_GERER.code);

  const resultatValidation = creerMenuItemSchema.safeParse({
    menu: formData.get("menu"),
    parentId: formData.get("parentId") || null,
    libelle: formData.get("libelle"),
    type: formData.get("type"),
    pageId: formData.get("pageId") || null,
    url: formData.get("url"),
    ordre: formData.get("ordre"),
    nouvelOnglet: formData.get("nouvelOnglet") === "on",
    actif: formData.get("actif") === "on",
  });

  if (!resultatValidation.success) {
    return {
      erreurs: ajouterErreursZod({}, resultatValidation.error.issues),
    };
  }

  try {
    await creerMenuItem(resultatValidation.data);
  } catch (error) {
    if (
      error instanceof ParentInvalideError ||
      error instanceof ParentDansUnAutreMenuError ||
      error instanceof ParentNonAutoriseError
    ) {
      return construireErreurParent(error);
    }

    if (error instanceof PageDejaUtiliseeDansMenuError) {
      return {
        erreurs: construireErreur("pageId", error.message),
      };
    }

    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_MENU_ITEMS);

  redirect(Routes.GESTION_MENU_ITEMS);
}

export async function modifierMenuItemAction(
  menuItemId: string,
  _state: MenuItemFormState,
  formData: FormData,
): Promise<MenuItemFormState> {
  await exigerPermission(Permissions.MENUS_GERER.code);

  const resultatValidation = modifierMenuItemSchema.safeParse({
    menu: formData.get("menu"),
    parentId: formData.get("parentId") || null,
    libelle: formData.get("libelle"),
    type: formData.get("type"),
    pageId: formData.get("pageId") || null,
    url: formData.get("url"),
    ordre: formData.get("ordre"),
    nouvelOnglet: formData.get("nouvelOnglet") === "on",
    actif: formData.get("actif") === "on",
  });

  if (!resultatValidation.success) {
    return {
      erreurs: ajouterErreursZod({}, resultatValidation.error.issues),
    };
  }

  try {
    await modifierMenuItem(menuItemId, resultatValidation.data);
  } catch (error) {
    if (
      error instanceof ParentInvalideError ||
      error instanceof ParentDansUnAutreMenuError ||
      error instanceof ParentNonAutoriseError
    ) {
      return construireErreurParent(error);
    }

    if (error instanceof PageDejaUtiliseeDansMenuError) {
      return {
        erreurs: construireErreur("pageId", error.message),
      };
    }

    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_MENU_ITEMS);

  redirect(Routes.menuItem(menuItemId));
}

export async function supprimerMenuItemAction(menuItemId: string) {
  await exigerPermission(Permissions.MENUS_GERER.code);

  try {
    await supprimerMenuItem(menuItemId);
  } catch (error) {
    if (error instanceof MenuItemPossedeDesEnfantsError) {
      throw error;
    }

    throw error;
  }

  revalidatePath(Routes.GESTION_MENU_ITEMS);
}

export async function modifierActivationMenuItemAction(
  menuItemId: string,
  actif: boolean,
) {
  await exigerPermission(Permissions.MENUS_GERER.code);

  await modifierActivationMenuItem(menuItemId, actif);

  revalidatePath(Routes.GESTION_MENU_ITEMS);
}

function construireErreurParent(error: Error) {
  return {
    erreurs: construireErreur("parentId", error.message),
  };
}

export interface ReordonnerMenuItemsData {
  id: string;
  parentId: string | null;
  ordre: number;
}

export async function reordonnerMenuItemsAction(
  items: ReordonnerMenuItemsData[],
) {
  await exigerPermission(Permissions.MENUS_GERER.code);

  await reordonnerMenuItems(items);

  revalidatePath(Routes.GESTION_MENU_ITEMS);

  return {
    success: true,
  };
}
