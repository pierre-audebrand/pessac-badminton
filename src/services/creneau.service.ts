import { Occurrence } from "@/lib/dates";
import { EntiteIntrouvableError } from "@/lib/errors";
import { ResultatPagine } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import {
  CreerCreneauData,
  ModifierCreneauData,
} from "@/schemas/creneau.schemas";
import { JourSemaine, Prisma } from "@prisma/client";

export const creneauSortableFields = [
  "jourSemaine",
  "salle",
  "heureDebut",
  "heureFin",
  "createdAt",
] as const;

export type CreneauSortField = (typeof creneauSortableFields)[number];

export interface RechercherCreneauxParams {
  page?: number;
  pageSize?: number;

  q?: string;

  sort?: CreneauSortField;

  order?: "asc" | "desc";
}

export type CreneauRecherche = Prisma.CreneauGetPayload<{
  include: {
    salle: true;

    groupes: {
      include: {
        groupe: true;
      };
    };
  };
}>;

export async function rechercherCreneaux({
  page = 1,
  pageSize = 20,
  q = "",
  sort = "heureDebut",
  order = "asc",
}: RechercherCreneauxParams = {}): Promise<ResultatPagine<CreneauRecherche>> {
  const search = q.trim();

  const jourRecherche = Object.values(JourSemaine).find(
    (jour) => jour === search.toUpperCase(),
  );

  const where = search
    ? {
        OR: [
          {
            salle: {
              nom: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },

          ...(jourRecherche
            ? [
                {
                  jourSemaine: jourRecherche,
                },
              ]
            : []),
        ],
      }
    : {};

  const safeSort = creneauSortableFields.includes(sort) ? sort : "heureDebut";

  const safePage = Math.max(1, page);

  const safePageSize = Math.min(Math.max(1, pageSize), 100);

  const [creneaux, total] = await Promise.all([
    prisma.creneau.findMany({
      where,

      include: {
        salle: true,

        groupes: {
          include: {
            groupe: true,
          },
        },
      },

      orderBy:
        sort === "salle"
          ? {
              salle: {
                nom: order,
              },
            }
          : {
              [safeSort]: order,
            },

      skip: (safePage - 1) * safePageSize,

      take: safePageSize,
    }),

    prisma.creneau.count({
      where,
    }),
  ]);

  return {
    elements: creneaux,

    total,

    page: safePage,

    pageSize: safePageSize,
    pageCount: Math.ceil(total / safePageSize),
  };
}

export type CreneauDetail = Prisma.CreneauGetPayload<{
  include: {
    salle: true;
    groupes: {
      include: {
        groupe: true;
      };
    };
  };
}>;

export interface OccurrenceCreneau extends Occurrence {
  creneau: CreneauDetail;
}

export async function listerCreneauxActifs(): Promise<CreneauDetail[]> {
  return prisma.creneau.findMany({
    where: {
      actif: true,
    },

    include: {
      salle: true,
      groupes: {
        include: {
          groupe: true,
        },
      },
    },

    orderBy: [
      {
        jourSemaine: "asc",
      },
      {
        heureDebut: "asc",
      },
    ],
  });
}

export async function listerCreneauxActifsSalle(
  salleId: string,
): Promise<CreneauDetail[]> {
  return prisma.creneau.findMany({
    where: {
      salleId,
      actif: true,
    },

    include: {
      salle: true,
      groupes: {
        include: {
          groupe: true,
        },
      },
    },

    orderBy: [
      {
        jourSemaine: "asc",
      },
      {
        heureDebut: "asc",
      },
    ],
  });
}

export async function recupererCreneauParId(id: string) {
  return prisma.creneau.findUnique({
    where: {
      id,
    },

    include: {
      salle: true,

      groupes: {
        include: {
          groupe: true,
        },
      },
    },
  });
}

export class CreneauEnConflitError extends Error {
  constructor() {
    super(
      "Un créneau existe déjà sur cette salle, ce jour et cette plage horaire",
    );
  }
}

export async function creerCreneau(data: CreerCreneauData) {
  /*const creneauEnConflit = await prisma.creneau.findFirst({
    where: {
      salleId: data.salleId,
      jourSemaine: data.jourSemaine,

      heureDebut: {
        lt: data.heureFin,
      },

      heureFin: {
        gt: data.heureDebut,
      },
    },
  });

  if (creneauEnConflit) throw new CreneauEnConflitError();*/

  return prisma.creneau.create({
    data: {
      salleId: data.salleId,
      jourSemaine: data.jourSemaine,
      heureDebut: data.heureDebut,
      heureFin: data.heureFin,
      type: data.type,
    },
  });
}

export async function modifierCreneau(
  creneauId: string,
  data: ModifierCreneauData,
) {
  const creneau = await prisma.creneau.findUnique({
    where: {
      id: creneauId,
    },
  });

  if (!creneau) {
    throw new EntiteIntrouvableError("Creneau");
  }

  /*const creneauEnConflit = await prisma.creneau.findFirst({
    where: {
      salleId: data.salleId,
      jourSemaine: data.jourSemaine,

      heureDebut: {
        lt: data.heureFin,
      },

      heureFin: {
        gt: data.heureDebut,
      },
      NOT: {
        id: creneauId,
      },
    },
  });

  if (creneauEnConflit) throw new CreneauEnConflitError();*/

  return prisma.creneau.update({
    where: {
      id: creneauId,
    },

    data,
  });
}

export async function modifierActivationCreneau(
  creneauId: string,
  actif: boolean,
) {
  const creneau = await prisma.creneau.findUnique({
    where: {
      id: creneauId,
    },
  });

  if (!creneau) {
    throw new EntiteIntrouvableError("Créneau");
  }

  return prisma.creneau.update({
    where: {
      id: creneauId,
    },
    data: {
      actif,
    },
  });
}
