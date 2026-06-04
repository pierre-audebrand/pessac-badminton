import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { ResultatPagine } from "@/lib/pagination";
import { EntiteIntrouvableError } from "@/lib/errors";

import { CreerGroupeData, ModifierGroupeData } from "@/schemas/groupe.schemas";

export const groupeSortableFields = ["nom", "ageMin", "createdAt"] as const;

export type GroupeSortField = (typeof groupeSortableFields)[number];

export interface RechercherGroupesParams {
  page?: number;
  pageSize?: number;

  q?: string;

  sort?: GroupeSortField;

  order?: "asc" | "desc";
}

export type GroupeRecherche = Prisma.GroupeGetPayload<{
  include: {
    _count: {
      select: {
        utilisateurs: true;
        creneaux: true;
      };
    };
  };
}>;

export async function rechercherGroupes({
  page = 1,
  pageSize = 20,
  q = "",
  sort = "nom",
  order = "asc",
}: RechercherGroupesParams = {}): Promise<ResultatPagine<GroupeRecherche>> {
  const search = q.trim();

  const where = search
    ? {
        OR: [
          {
            nom: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const safeSort = groupeSortableFields.includes(sort) ? sort : "nom";

  const safePage = Math.max(1, page);

  const safePageSize = Math.min(Math.max(1, pageSize), 100);

  const [groupes, total] = await Promise.all([
    prisma.groupe.findMany({
      where,

      include: {
        _count: {
          select: {
            utilisateurs: true,
            creneaux: true,
          },
        },
      },

      orderBy: {
        [safeSort]: order,
      },

      skip: (safePage - 1) * safePageSize,

      take: safePageSize,
    }),

    prisma.groupe.count({
      where,
    }),
  ]);

  return {
    elements: groupes,

    total,

    page: safePage,

    pageSize: safePageSize,

    pageCount: Math.ceil(total / safePageSize),
  };
}

export async function listerGroupesActifs() {
  return prisma.groupe.findMany({
    where: {
      actif: true,
    },

    orderBy: {
      nom: "asc",
    },
  });
}

export async function recupererGroupeParId(id: string) {
  return prisma.groupe.findUnique({
    where: {
      id,
    },

    include: {
      utilisateurs: {
        include: {
          utilisateur: true,
        },
      },

      creneaux: {
        include: {
          creneau: {
            include: {
              salle: true,
            },
          },
        },
      },
    },
  });
}

export class GroupeDejaExistantError extends Error {
  constructor() {
    super("Un groupe portant ce nom existe déjà");
  }
}

export async function creerGroupe(data: CreerGroupeData) {
  const groupeExistant = await prisma.groupe.findFirst({
    where: {
      nom: {
        equals: data.nom,
        mode: "insensitive",
      },
    },
  });

  if (groupeExistant) {
    throw new GroupeDejaExistantError();
  }

  return prisma.groupe.create({
    data: {
      nom: data.nom,
      description: data.description,
      ageMin: data.ageMin,
      ageMax: data.ageMax,
    },
  });
}

export async function modifierGroupe(
  groupeId: string,
  data: ModifierGroupeData,
) {
  const groupe = await prisma.groupe.findUnique({
    where: {
      id: groupeId,
    },
  });

  if (!groupe) {
    throw new EntiteIntrouvableError("Groupe");
  }

  const groupeExistant = await prisma.groupe.findFirst({
    where: {
      nom: {
        equals: data.nom,
        mode: "insensitive",
      },

      NOT: {
        id: groupeId,
      },
    },
  });

  if (groupeExistant) {
    throw new GroupeDejaExistantError();
  }

  return prisma.groupe.update({
    where: {
      id: groupeId,
    },

    data,
  });
}

export async function modifierActivationGroupe(
  groupeId: string,
  actif: boolean,
) {
  const creneau = await prisma.groupe.findUnique({
    where: {
      id: groupeId,
    },
  });

  if (!creneau) {
    throw new EntiteIntrouvableError("Créneau");
  }

  return prisma.groupe.update({
    where: {
      id: groupeId,
    },
    data: {
      actif,
    },
  });
}
