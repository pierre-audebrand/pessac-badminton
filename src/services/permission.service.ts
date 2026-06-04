import { ResultatPagine } from "@/lib/pagination";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const permissionSortableFields = [
  "code",
  "libelle",
  "description",
  "createdAt",
] as const;

export type PermissionSortField = (typeof permissionSortableFields)[number];

export interface RechercherPermissionsParams {
  page?: number;
  pageSize?: number;

  q?: string;

  sort?: PermissionSortField;

  order?: "asc" | "desc";
}

export type PermissionRecherche = Prisma.PermissionGetPayload<{
  include: {
    roles: {
      include: {
        role: true;
      };
    };
  };
}>;

export async function rechercherPermissions({
  page = 1,
  pageSize = 20,
  q = "",
  sort = "code",
  order = "asc",
}: RechercherPermissionsParams = {}): Promise<
  ResultatPagine<PermissionRecherche>
> {
  const search = q.trim();

  const where = search
    ? {
        OR: [
          {
            code: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            libelle: {
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

  const safeSort = permissionSortableFields.includes(sort) ? sort : "code";

  const safePage = Math.max(1, page);

  const safePageSize = Math.min(Math.max(1, pageSize), 100);

  const [permissions, total] = await Promise.all([
    prisma.permission.findMany({
      where,

      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },

      orderBy: {
        [safeSort]: order,
      },

      skip: (safePage - 1) * safePageSize,

      take: safePageSize,
    }),

    prisma.permission.count({
      where,
    }),
  ]);

  return {
    elements: permissions,

    total,

    page: safePage,

    pageSize: safePageSize,
    pageCount: Math.ceil(total / safePageSize),
  };
}

export async function listerPermissions() {
  return prisma.permission.findMany({
    orderBy: {
      code: "asc",
    },
  });
}
