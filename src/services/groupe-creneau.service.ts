import { EntiteIntrouvableError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

export async function modifierGroupesCreneau(
  creneauId: string,
  groupeIds: string[],
) {
  const creneau = await prisma.creneau.findUnique({
    where: {
      id: creneauId,
    },
  });

  if (!creneau) {
    throw new EntiteIntrouvableError("Creneau");
  }

  await prisma.creneau.update({
    where: {
      id: creneauId,
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
