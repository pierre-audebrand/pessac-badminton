import { EntiteIntrouvableError } from "@/lib/errors";
import { ResultatPagine } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import {
  CreerUtilisateurData,
  ModifierUtilisateurData,
} from "@/schemas/utilisateur.schemas";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

export const utilisateurSortableFields = [
  "nom",
  "prenom",
  "dateNaissance",
  "email",
  "createdAt",
] as const;

export type UtilisateurSortField = (typeof utilisateurSortableFields)[number];

export interface RechercherUtilisateursParams {
  page?: number;
  pageSize?: number;

  q?: string;

  sort?: UtilisateurSortField;

  order?: "asc" | "desc";
}

export type UtilisateurRecherche = Prisma.UtilisateurGetPayload<{
  include: {
    roles: {
      include: {
        role: true;
      };
    };
    groupes: {
      include: {
        groupe: true;
      };
    };
  };
}>;

export async function rechercherUtilisateurs({
  page = 1,
  pageSize = 20,
  q = "",
  sort = "nom",
  order = "asc",
}: RechercherUtilisateursParams = {}): Promise<
  ResultatPagine<UtilisateurRecherche>
> {
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
            prenom: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const safeSort = utilisateurSortableFields.includes(sort) ? sort : "nom";

  const safePage = Math.max(1, page);

  const safePageSize = Math.min(Math.max(1, pageSize), 100);

  const [utilisateurs, total] = await Promise.all([
    prisma.utilisateur.findMany({
      where,

      include: {
        roles: {
          include: {
            role: true,
          },
        },

        groupes: {
          include: {
            groupe: true,
          },
        },
      },

      orderBy: {
        [safeSort]: order,
      },

      skip: (safePage - 1) * safePageSize,

      take: safePageSize,
    }),

    prisma.utilisateur.count({
      where,
    }),
  ]);

  return {
    elements: utilisateurs,

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

export async function recupererUtilisateurParEmail(email: string) {
  return prisma.utilisateur.findUnique({
    where: { email },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function recupererUtilisateurParId(id: string) {
  return prisma.utilisateur.findUnique({
    where: {
      id,
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
      groupes: {
        include: {
          groupe: true,
        },
      },
    },
  });
}

export class UtilisateurDejaExistantError extends Error {
  constructor() {
    super("Un utilisateur ayant cet email existe déjà");
  }
}

export async function creerUtilisateur(data: CreerUtilisateurData) {
  const utilisateurExistant = await prisma.utilisateur.findFirst({
    where: {
      email: {
        equals: data.email,
        mode: "insensitive",
      },
    },
  });

  if (utilisateurExistant) throw new UtilisateurDejaExistantError();

  const hash = await bcrypt.hash(data.motDePasse, 12);

  return prisma.utilisateur.create({
    data: {
      prenom: data.prenom,
      nom: data.nom,
      dateNaissance: data.dateNaissance,
      email: data.email,
      motDePasseHash: hash,
    },
  });
}

export async function modifierUtilisateur(
  utilisateurId: string,
  data: ModifierUtilisateurData,
) {
  const utilisateur = await prisma.utilisateur.findUnique({
    where: {
      id: utilisateurId,
    },
  });

  if (!utilisateur) {
    throw new EntiteIntrouvableError("Utilisateur");
  }

  const utilisateurExistant = await prisma.utilisateur.findFirst({
    where: {
      email: {
        equals: data.email,
        mode: "insensitive",
      },
      NOT: {
        id: utilisateurId,
      },
    },
  });

  if (utilisateurExistant) throw new UtilisateurDejaExistantError();

  return prisma.utilisateur.update({
    where: {
      id: utilisateurId,
    },

    data,
  });
}

export async function modifierActivationUtilisateur(
  utilisateurId: string,
  actif: boolean,
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
      actif,
    },
  });
}
