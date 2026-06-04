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

import { modifierGroupesUtilisateurSchema } from "@/schemas/groupe-utilisateur.schemas";

import { modifierGroupesUtilisateur } from "@/services/groupe-utilisateur.service";

export type UtilisateurGroupesFormState = FormState<"groupes">;

export async function modifierGroupesUtilisateurAction(
  utilisateurId: string,
  _state: UtilisateurGroupesFormState,
  formData: FormData,
): Promise<UtilisateurGroupesFormState> {
  await exigerPermission(Permissions.UTILISATEURS_GERER.code);

  const resultatValidation = modifierGroupesUtilisateurSchema.safeParse({
    groupes: formData.getAll("groupes"),
  });

  if (!resultatValidation.success) {
    return {
      erreurs: ajouterErreursZod({}, resultatValidation.error.issues),
    };
  }

  try {
    await modifierGroupesUtilisateur(
      utilisateurId,
      resultatValidation.data.groupes,
    );
  } catch (error) {
    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_UTILISATEURS);
  revalidatePath(Routes.utilisateur(utilisateurId));
  revalidatePath(Routes.groupesUtilisateur(utilisateurId));

  return {
    succes: true,
    message: "Groupes enregistrés avec succès.",
  };
}
