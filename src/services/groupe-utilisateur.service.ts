import { EntiteIntrouvableError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { calculerAge } from "@/lib/utilisateurs";

export class AgeIncompatibleAvecGroupeError extends Error {
  constructor(groupeNom: string) {
    super(
      `L'âge de l'utilisateur est incompatible avec le groupe ${groupeNom}`,
    );
  }
}

export async function modifierGroupesUtilisateur(
  utilisateurId: string,
  groupeIds: string[],
) {
  const utilisateur = await prisma.utilisateur.findUnique({
    where: {
      id: utilisateurId,
    },
  });

  if (!utilisateur) {
    throw new EntiteIntrouvableError("Utilisateur");
  }

  if (utilisateur.dateNaissance && groupeIds.length > 0) {
    const groupes = await prisma.groupe.findMany({
      where: {
        id: {
          in: groupeIds,
        },
        actif: true,
      },
    });

    if (groupes.length !== groupeIds.length) {
      throw new EntiteIntrouvableError("Groupe");
    }

    const age = calculerAge(utilisateur.dateNaissance);

    for (const groupe of groupes) {
      if (groupe.ageMin != null && age < groupe.ageMin) {
        throw new AgeIncompatibleAvecGroupeError(groupe.nom);
      }

      if (groupe.ageMax != null && age > groupe.ageMax) {
        throw new AgeIncompatibleAvecGroupeError(groupe.nom);
      }
    }
  }

  return prisma.utilisateur.update({
    where: {
      id: utilisateurId,
    },

    data: {
      groupes: {
        deleteMany: {},

        create: groupeIds.map((groupeId) => ({
          groupeId,
        })),
      },
    },
  });
}
