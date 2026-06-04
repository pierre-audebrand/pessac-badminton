import { Prisma } from "@prisma/client";
import { ResultatPagine } from "../lib/pagination";
import { prisma } from "@/lib/prisma";
import { CreerSalleData, ModifierSalleData } from "@/schemas/salle.schemas";
import { EntiteIntrouvableError } from "@/lib/errors";

export const salleSortableFields = ["nom", "ville", "createdAt"] as const;

export type SalleSortField = (typeof salleSortableFields)[number];

export interface RechercherSallesParams {
  page?: number;
  pageSize?: number;

  q?: string;

  sort?: SalleSortField;

  order?: "asc" | "desc";
}

export type SalleRecherche = Prisma.SalleGetPayload<{
  include: {
    _count: {
      select: {
        creneaux: true;
      };
    };

    indisponibilites: {
      where: {
        debut: {
          gte: Date;
        };
      };
      orderBy: {
        debut: "asc";
      };
    };
  };
}>;

export async function rechercherSalles({
  page = 1,
  pageSize = 20,
  q = "",
  sort = "nom",
  order = "asc",
}: RechercherSallesParams = {}): Promise<ResultatPagine<SalleRecherche>> {
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
            adresse: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            codePostal: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            ville: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const safeSort = salleSortableFields.includes(sort) ? sort : "nom";

  const safePage = Math.max(1, page);

  const safePageSize = Math.min(Math.max(1, pageSize), 100);

  const maintenant = new Date();

  const [salles, total] = await Promise.all([
    prisma.salle.findMany({
      where,

      include: {
        _count: {
          select: {
            creneaux: true,
          },
        },

        indisponibilites: {
          where: {
            debut: {
              gte: maintenant,
            },
          },

          orderBy: {
            debut: "asc",
          },
        },
      },

      orderBy: {
        [safeSort]: order,
      },

      skip: (safePage - 1) * safePageSize,

      take: safePageSize,
    }),

    prisma.salle.count({
      where,
    }),
  ]);

  return {
    elements: salles,

    total,

    page: safePage,

    pageSize: safePageSize,
    pageCount: Math.ceil(total / safePageSize),
  };
}

export async function listerSallesActives() {
  return prisma.salle.findMany({
    where: {
      actif: true,
    },

    orderBy: {
      nom: "asc",
    },
  });
}

export async function recupererSalleParId(id: string) {
  const maintenant = new Date();

  return prisma.salle.findUnique({
    where: {
      id,
    },

    include: {
      creneaux: {
        include: {
          groupes: {
            include: {
              groupe: true,
            },
          },
        },
      },

      indisponibilites: {
        where: {
          fin: {
            gt: maintenant,
          },
        },

        orderBy: {
          debut: "asc",
        },
      },
    },
  });
}

export class SalleDejaExistanteError extends Error {
  constructor() {
    super("Une salle portant ce nom existe déjà");
  }
}

export async function creerSalle(data: CreerSalleData) {
  const salleExistante = await prisma.salle.findFirst({
    where: {
      nom: {
        equals: data.nom,
        mode: "insensitive",
      },
    },
  });

  if (salleExistante) throw new SalleDejaExistanteError();

  return prisma.salle.create({
    data: {
      nom: data.nom,
      adresse: data.adresse,
      codePostal: data.codePostal,
      ville: data.ville,
    },
  });
}

export async function modifierSalle(salleId: string, data: ModifierSalleData) {
  const salle = await prisma.salle.findUnique({
    where: {
      id: salleId,
    },
  });

  if (!salle) {
    throw new EntiteIntrouvableError("Salle");
  }

  const salleExistante = await prisma.salle.findFirst({
    where: {
      nom: {
        equals: data.nom,
        mode: "insensitive",
      },
      NOT: {
        id: salleId,
      },
    },
  });

  if (salleExistante) throw new SalleDejaExistanteError();

  return prisma.salle.update({
    where: {
      id: salleId,
    },

    data,
  });
}

export async function modifierActivationSalle(salleId: string, actif: boolean) {
  const salle = await prisma.salle.findUnique({
    where: {
      id: salleId,
    },
  });

  if (!salle) {
    throw new EntiteIntrouvableError("Salle");
  }

  return prisma.salle.update({
    where: {
      id: salleId,
    },
    data: {
      actif,
    },
  });
}
