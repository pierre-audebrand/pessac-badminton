"use server";

import { revalidatePath } from "next/cache";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import {
  ajouterErreursZod,
  construireErreurException,
  FormState,
} from "@/lib/formulaire";

import { modifierGroupesCreneauSchema } from "@/schemas/groupe-creneau.schemas";

import { modifierGroupesCreneau } from "@/services/groupe-creneau.service";

export type CreneauGroupesFormState = FormState<"groupes">;

export async function modifierGroupesCreneauAction(
  creneauId: string,
  _state: CreneauGroupesFormState,
  formData: FormData,
): Promise<CreneauGroupesFormState> {
  await exigerPermission(Permissions.CRENEAUX_GERER.code);

  const resultatValidation = modifierGroupesCreneauSchema.safeParse({
    groupes: formData.getAll("groupes"),
  });

  if (!resultatValidation.success) {
    return {
      erreurs: ajouterErreursZod({}, resultatValidation.error.issues),
    };
  }

  try {
    await modifierGroupesCreneau(creneauId, resultatValidation.data.groupes);
  } catch (error) {
    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_CRENEAUX);
  revalidatePath(Routes.creneau(creneauId));
  revalidatePath(Routes.groupesCreneau(creneauId));

  return {
    succes: true,
    message: "Groupes enregistrés avec succès.",
  };
}
