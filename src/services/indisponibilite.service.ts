import { chevauche, creerOccurrence, Occurrence } from "@/lib/dates";
import { EntiteIntrouvableError } from "@/lib/errors";
import { joursSemaine } from "@/lib/jours-semaine";
import { ResultatPagine } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import {
  CreerIndisponibiliteData,
  ModifierIndisponibiliteData,
} from "@/schemas/indisponibilite.schemas";
import { Prisma } from "@prisma/client";
import {
  CreneauDetail,
  OccurrenceCreneau,
  listerCreneauxActifsSalle,
} from "./creneau.service";

export const indisponibiliteSortableFields = [
  "debut",
  "fin",
  "createdAt",
] as const;

export type IndisponibiliteSortField =
  (typeof indisponibiliteSortableFields)[number];

export interface RechercherIndisponibilitesParams {
  page?: number;
  pageSize?: number;

  q?: string;

  sort?: IndisponibiliteSortField;

  order?: "asc" | "desc";
}

export type IndisponibiliteRecherche = Prisma.IndisponibiliteGetPayload<{
  include: {
    salle: true;
  };
}>;

export async function rechercherIndisponibilites({
  page = 1,
  pageSize = 20,
  q = "",
  sort = "debut",
  order = "desc",
}: RechercherIndisponibilitesParams = {}): Promise<
  ResultatPagine<IndisponibiliteRecherche>
> {
  const search = q.trim();

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

          {
            motif: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const safeSort = indisponibiliteSortableFields.includes(sort)
    ? sort
    : "debut";

  const safePage = Math.max(1, page);

  const safePageSize = Math.min(Math.max(1, pageSize), 100);

  const [indisponibilites, total] = await Promise.all([
    prisma.indisponibilite.findMany({
      where,

      include: {
        salle: true,
      },

      orderBy: {
        [safeSort]: order,
      },

      skip: (safePage - 1) * safePageSize,

      take: safePageSize,
    }),

    prisma.indisponibilite.count({
      where,
    }),
  ]);

  return {
    elements: indisponibilites,

    total,

    page: safePage,

    pageSize: safePageSize,

    pageCount: Math.ceil(total / safePageSize),
  };
}

export async function recupererIndisponibiliteParId(id: string) {
  return prisma.indisponibilite.findUnique({
    where: {
      id,
    },

    include: {
      salle: true,
    },
  });
}

export class IndisponibiliteEnConflitError extends Error {
  constructor() {
    super("Une indisponibilité existe déjà sur cette période pour cette salle");
  }
}

async function verifierConflit(
  salleId: string,
  debut: Date,
  fin: Date,
  indisponibiliteId?: string,
) {
  const conflit = await prisma.indisponibilite.findFirst({
    where: {
      salleId,

      debut: {
        lt: fin,
      },

      fin: {
        gt: debut,
      },

      ...(indisponibiliteId && {
        NOT: {
          id: indisponibiliteId,
        },
      }),
    },
  });

  if (conflit) {
    throw new IndisponibiliteEnConflitError();
  }
}

export async function creerIndisponibilite(data: CreerIndisponibiliteData) {
  await verifierConflit(data.salleId, data.debut, data.fin);

  return prisma.indisponibilite.create({
    data,
  });
}

export async function modifierIndisponibilite(
  indisponibiliteId: string,
  data: ModifierIndisponibiliteData,
) {
  const indisponibilite = await prisma.indisponibilite.findUnique({
    where: {
      id: indisponibiliteId,
    },
  });

  if (!indisponibilite) {
    throw new EntiteIntrouvableError("Indisponibilité");
  }

  await verifierConflit(data.salleId, data.debut, data.fin, indisponibiliteId);

  return prisma.indisponibilite.update({
    where: {
      id: indisponibiliteId,
    },

    data,
  });
}

export async function supprimerIndisponibilite(indisponibiliteId: string) {
  const indisponibilite = await prisma.indisponibilite.findUnique({
    where: {
      id: indisponibiliteId,
    },
  });

  if (!indisponibilite) {
    throw new EntiteIntrouvableError("Indisponibilité");
  }

  await prisma.indisponibilite.delete({
    where: {
      id: indisponibiliteId,
    },
  });
}

export interface OccurrenceIndisponibilite extends Occurrence {
  id: string;
  motif: string | null;
}

function calculerOccurrencesImpactees(
  creneaux: CreneauDetail[],
  debutIndisponibilite: Date,
  finIndisponibilite: Date,
): OccurrenceCreneau[] {
  const impactes: OccurrenceCreneau[] = [];

  const indisponibilite: Occurrence = {
    debut: debutIndisponibilite,
    fin: finIndisponibilite,
  };

  const curseur = new Date(debutIndisponibilite);
  curseur.setHours(0, 0, 0, 0);

  const finPeriode = new Date(finIndisponibilite);
  finPeriode.setHours(23, 59, 59, 999);

  while (curseur <= finPeriode) {
    const jourCourant = curseur.getDay();

    for (const creneau of creneaux) {
      if (joursSemaine[creneau.jourSemaine].numeroJs !== jourCourant) {
        continue;
      }

      const occurrence = creerOccurrence(
        curseur,
        creneau.heureDebut,
        creneau.heureFin,
      );

      if (chevauche(occurrence, indisponibilite)) {
        impactes.push({
          creneau,
          ...occurrence,
        });
      }
    }

    curseur.setDate(curseur.getDate() + 1);
  }

  return impactes;
}

export async function listerOccurrencesCreneauImpactees(
  salleId: string,
  debutIndisponibilite: Date,
  finIndisponibilite: Date,
): Promise<OccurrenceCreneau[]> {
  const creneaux = await listerCreneauxActifsSalle(salleId);

  return calculerOccurrencesImpactees(
    creneaux,
    debutIndisponibilite,
    finIndisponibilite,
  );
}

export interface OccurrenceCreneauAnnule {
  indisponibilite: OccurrenceIndisponibilite;
  occurrence: OccurrenceCreneau;
}

export async function listerProchainesOccurrencesCreneauAnnule(
  creneauId: string,
): Promise<OccurrenceCreneauAnnule[]> {
  const creneau = await prisma.creneau.findUnique({
    where: {
      id: creneauId,
    },

    include: {
      groupes: {
        include: {
          groupe: true,
        },
      },

      salle: {
        include: {
          indisponibilites: {
            where: {
              fin: {
                gt: new Date(),
              },
            },

            orderBy: {
              debut: "asc",
            },
          },
        },
      },
    },
  });

  if (!creneau) {
    return [];
  }

  const resultat: OccurrenceCreneauAnnule[] = [];

  const maintenant = new Date();

  for (const indisponibilite of creneau.salle.indisponibilites) {
    const occurrences = calculerOccurrencesImpactees(
      [creneau],
      indisponibilite.debut,
      indisponibilite.fin,
    );

    for (const occurrence of occurrences) {
      if (occurrence.fin <= maintenant) {
        continue;
      }

      resultat.push({
        indisponibilite: {
          id: indisponibilite.id,
          debut: indisponibilite.debut,
          fin: indisponibilite.fin,
          motif: indisponibilite.motif,
        },

        occurrence,
      });
    }
  }

  resultat.sort(
    (a, b) => a.occurrence.debut.getTime() - b.occurrence.debut.getTime(),
  );

  return resultat;
}
