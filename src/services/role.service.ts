import { EntiteIntrouvableError } from "@/lib/errors";
import { ResultatPagine } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

import { CreerRoleData, ModifierRoleData } from "@/schemas/role.schemas";
import { Prisma } from "@prisma/client";

export const roleSortableFields = ["nom", "createdAt"] as const;

export type RoleSortField = (typeof roleSortableFields)[number];

export interface RechercherRolesParams {
  page?: number;
  pageSize?: number;

  q?: string;

  sort?: RoleSortField;

  order?: "asc" | "desc";
}

export type RoleRecherche = Prisma.RoleGetPayload<{
  include: {
    permissions: {
      include: {
        permission: true;
      };
    };
    utilisateurs: true;
    _count: {
      select: {
        utilisateurs: true;
      };
    };
  };
}>;

export async function rechercherRoles({
  page = 1,
  pageSize = 20,
  q = "",
  sort = "nom",
  order = "asc",
}: RechercherRolesParams = {}): Promise<ResultatPagine<RoleRecherche>> {
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

  const safeSort = roleSortableFields.includes(sort) ? sort : "nom";

  const safePage = Math.max(1, page);

  const safePageSize = Math.min(Math.max(1, pageSize), 100);

  const [roles, total] = await Promise.all([
    prisma.role.findMany({
      where,

      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        utilisateurs: true,
        _count: {
          select: {
            utilisateurs: true,
          },
        },
      },

      orderBy: {
        [safeSort]: order,
      },

      skip: (safePage - 1) * safePageSize,

      take: safePageSize,
    }),

    prisma.role.count({
      where,
    }),
  ]);

  return {
    elements: roles,

    total,

    page: safePage,

    pageSize: safePageSize,
    pageCount: Math.ceil(total / safePageSize),
  };
}

export async function listerRoles() {
  return prisma.role.findMany({
    orderBy: {
      nom: "asc",
    },
  });
}

export async function recupererRoleParId(id: string) {
  return prisma.role.findUnique({
    where: {
      id,
    },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
      utilisateurs: {
        include: {
          utilisateur: true,
        },
      },
    },
  });
}

export class RoleDejaExistantError extends Error {
  constructor() {
    super("Un rôle portant ce nom existe déjà");
  }
}

export async function creerRole(data: CreerRoleData) {
  const roleExistant = await prisma.role.findFirst({
    where: {
      nom: {
        equals: data.nom,
        mode: "insensitive",
      },
    },
  });

  if (roleExistant) throw new RoleDejaExistantError();

  return prisma.role.create({
    data: {
      nom: data.nom,
      description: data.description,

      permissions: {
        create: data.permissions.map((permissionId) => ({
          permissionId,
        })),
      },
    },

    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
}

export async function modifierRole(roleId: string, data: ModifierRoleData) {
  const role = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
  });

  if (!role) {
    throw new EntiteIntrouvableError("Rôle");
  }

  const roleExistant = await prisma.role.findFirst({
    where: {
      nom: {
        equals: data.nom,
        mode: "insensitive",
      },
      NOT: {
        id: roleId,
      },
    },
  });

  if (roleExistant) throw new RoleDejaExistantError();

  return prisma.role.update({
    where: {
      id: roleId,
    },

    data: {
      nom: data.nom,
      description: data.description,

      permissions: {
        deleteMany: {},

        create: data.permissions.map((permissionId) => ({
          permissionId,
        })),
      },
    },

    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
}

export class RoleAttribueError extends Error {
  constructor() {
    super("Impossible de supprimer un rôle attribué à des utilisateurs");
  }
}

export class RoleSystemeError extends Error {
  constructor() {
    super("Cette opération n'est pas autorisée sur un rôle système");
  }
}

export async function supprimerRole(roleId: string) {
  const role = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
    include: {
      _count: {
        select: {
          utilisateurs: true,
        },
      },
    },
  });

  if (!role) {
    throw new EntiteIntrouvableError("Rôle");
  }

  if (role.systeme) {
    throw new RoleSystemeError();
  }

  if (role._count.utilisateurs > 0) {
    throw new RoleAttribueError();
  }

  return prisma.role.delete({
    where: {
      id: roleId,
    },
  });
}
