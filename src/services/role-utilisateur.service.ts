import { EntiteIntrouvableError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

export async function modifierRolesUtilisateur(
  utilisateurId: string,
  roleIds: string[],
) {
  const utilisateur = await prisma.utilisateur.findUnique({
    where: {
      id: utilisateurId,
    },
  });

  if (!utilisateur) {
    throw new EntiteIntrouvableError("Utilisateur");
  }

  return prisma.utilisateur.update({
    where: {
      id: utilisateurId,
    },
    data: {
      roles: {
        deleteMany: {},

        create: roleIds.map((roleId) => ({
          roleId,
        })),
      },
    },
  });
}
