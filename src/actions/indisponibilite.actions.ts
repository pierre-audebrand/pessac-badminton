"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import { exigerPermission } from "@/lib/autorisations";

import {
  ajouterErreursZod,
  construireErreurException,
  FormState,
} from "@/lib/formulaire";

import {
  creerIndisponibiliteSchema,
  modifierIndisponibiliteSchema,
} from "@/schemas/indisponibilite.schemas";

import {
  creerIndisponibilite,
  modifierIndisponibilite,
  supprimerIndisponibilite,
  IndisponibiliteEnConflitError,
  listerOccurrencesCreneauImpactees,
} from "@/services/indisponibilite.service";

export type IndisponibiliteFormState = FormState<
  "salleId" | "debut" | "fin" | "motif"
>;

export async function creerIndisponibiliteAction(
  _state: IndisponibiliteFormState,
  formData: FormData,
): Promise<IndisponibiliteFormState> {
  await exigerPermission(Permissions.SALLES_GERER.code);

  const resultatValidation = creerIndisponibiliteSchema.safeParse({
    salleId: formData.get("salleId"),
    debut: formData.get("debut"),
    fin: formData.get("fin"),
    motif: formData.get("motif"),
  });

  if (!resultatValidation.success) {
    return {
      erreurs: ajouterErreursZod({}, resultatValidation.error.issues),
    };
  }

  try {
    await creerIndisponibilite(resultatValidation.data);
  } catch (error) {
    if (error instanceof IndisponibiliteEnConflitError) {
      return {
        erreurs: {
          debut: [error.message],
        },
      };
    }

    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_INDISPONIBILITES);

  redirect(Routes.GESTION_INDISPONIBILITES);
}

export async function modifierIndisponibiliteAction(
  indisponibiliteId: string,
  _state: IndisponibiliteFormState,
  formData: FormData,
): Promise<IndisponibiliteFormState> {
  await exigerPermission(Permissions.SALLES_GERER.code);

  const resultatValidation = modifierIndisponibiliteSchema.safeParse({
    salleId: formData.get("salleId"),
    debut: formData.get("debut"),
    fin: formData.get("fin"),
    motif: formData.get("motif"),
  });

  if (!resultatValidation.success) {
    return {
      erreurs: ajouterErreursZod({}, resultatValidation.error.issues),
    };
  }

  try {
    await modifierIndisponibilite(indisponibiliteId, resultatValidation.data);
  } catch (error) {
    if (error instanceof IndisponibiliteEnConflitError) {
      return {
        erreurs: {
          debut: [error.message],
        },
      };
    }

    return construireErreurException(error);
  }

  revalidatePath(Routes.GESTION_INDISPONIBILITES);

  redirect(Routes.indisponibilite(indisponibiliteId));
}

export async function supprimerIndisponibiliteAction(
  indisponibiliteId: string,
) {
  await exigerPermission(Permissions.SALLES_GERER.code);

  await supprimerIndisponibilite(indisponibiliteId);

  revalidatePath(Routes.GESTION_INDISPONIBILITES);
}

export async function recupererOccurrencesImpacteesAction(
  salleId: string,
  debut: string,
  fin: string,
) {
  await exigerPermission(Permissions.SALLES_GERER.code);

  if (!salleId || !debut || !fin) {
    return [];
  }

  return listerOccurrencesCreneauImpactees(
    salleId,
    new Date(debut),
    new Date(fin),
  );
}
