"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import {
  creerPage,
  modifierPage,
  supprimerPage,
  PageDejaExistanteError,
  modifierPublicationPage,
} from "@/services/page.service";

import { creerPageSchema, modifierPageSchema } from "@/schemas/page.schemas";

import {
  ajouterErreursZod,
  construireErreur,
  construireErreurException,
  FormState,
} from "@/lib/formulaire";

export type PageFormState = FormState<
  "titre" | "chemin" | "seoTitre" | "seoDescription" | "publiee"
>;

export async function creerPageAction(
  _state: PageFormState,
  formData: FormData,
): Promise<PageFormState> {
  await exigerPermission(Permissions.PAGES_GERER.code);

  const resultatValidation = creerPageSchema.safeParse({
    titre: formData.get("titre"),
    chemin: formData.get("chemin"),
    seoTitre: formData.get("seoTitre"),
    seoDescription: formData.get("seoDescription"),
    publiee: formData.get("publiee") === "on",
  });

  if (!resultatValidation.success) {
    return {
      erreurs: ajouterErreursZod({}, resultatValidation.error.issues),
    };
  }

  try {
    await creerPage(resultatValidation.data);
  } catch (error) {
    if (error instanceof PageDejaExistanteError) {
      return {
        erreurs: construireErreur("chemin", error.message),
      };
    }

    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_PAGES);

  redirect(Routes.GESTION_PAGES);
}

export async function modifierPageAction(
  pageId: string,
  _state: PageFormState,
  formData: FormData,
): Promise<PageFormState> {
  await exigerPermission(Permissions.PAGES_GERER.code);

  const resultatValidation = modifierPageSchema.safeParse({
    titre: formData.get("titre"),
    chemin: formData.get("chemin"),
    seoTitre: formData.get("seoTitre"),
    seoDescription: formData.get("seoDescription"),
    publiee: formData.get("publiee") === "on",
  });

  if (!resultatValidation.success) {
    return {
      erreurs: ajouterErreursZod({}, resultatValidation.error.issues),
    };
  }

  try {
    await modifierPage(pageId, resultatValidation.data);
  } catch (error) {
    if (error instanceof PageDejaExistanteError) {
      return {
        erreurs: construireErreur("chemin", error.message),
      };
    }

    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_PAGES);

  redirect(Routes.page(pageId));
}

export async function supprimerPageAction(pageId: string) {
  await exigerPermission(Permissions.PAGES_GERER.code);

  await supprimerPage(pageId);

  revalidatePath(Routes.GESTION_PAGES);
}

export async function modifierPublicationPageAction(
  pageId: string,
  publiee: boolean,
) {
  await exigerPermission(Permissions.PAGES_GERER.code);

  await modifierPublicationPage(pageId, publiee);

  revalidatePath(Routes.GESTION_PAGES);
}
