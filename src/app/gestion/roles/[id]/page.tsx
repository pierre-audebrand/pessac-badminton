import Link from "next/link";
import { notFound } from "next/navigation";

import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/ui/page/page-section";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";
import { formaterDate } from "@/lib/dates";

import { recupererRoleParId } from "@/services/role.service";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RolePage({ params }: Props) {
  await exigerPermission(Permissions.ROLES_GERER.code);

  const { id } = await params;

  const role = await recupererRoleParId(id);

  if (!role) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{role.nom}</h1>

            {role.systeme && <Badge variant="secondary">Système</Badge>}
          </div>

          <p className="text-muted-foreground">
            {role.description || "Aucune description"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          <Button asChild>
            <Link href={Routes.modifierRole(role.id)}>
              <Pencil className="h-4 w-4" />
              Modifier
            </Link>
          </Button>
        </div>
      </div>

      <PageSection title="Informations" className="space-y-3" bordered={false}>
        <div>
          <p className="text-sm text-muted-foreground">Nom</p>

          <p>{role.nom}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Description</p>

          <p>{role.description || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Type</p>

          <p>{role.systeme ? "Rôle système" : "Rôle personnalisé"}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Créé le</p>

          <p>{formaterDate(role.createdAt)}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Modifié le</p>

          <p>{formaterDate(role.updatedAt)}</p>
        </div>
      </PageSection>

      <PageSection
        title={`Permissions (${role.permissions.length})`}
        bordered={false}
      >
        {role.permissions.length === 0 ? (
          <p className="text-muted-foreground">Aucune permission.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {role.permissions.map((rolePermission) => (
              <Badge key={rolePermission.permission.id} variant="outline">
                {rolePermission.permission.libelle}
              </Badge>
            ))}
          </div>
        )}
      </PageSection>

      <PageSection
        title={`Utilisateurs (${role.utilisateurs.length})`}
        bordered={false}
      >
        {role.utilisateurs.length === 0 ? (
          <p className="text-muted-foreground">Aucun utilisateur associé.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {role.utilisateurs.map((utilisateurRole) => (
              <Link
                key={utilisateurRole.utilisateur.id}
                href={Routes.utilisateur(utilisateurRole.utilisateur.id)}
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary/80"
                >
                  {utilisateurRole.utilisateur.prenom}{" "}
                  {utilisateurRole.utilisateur.nom}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </PageSection>
    </div>
  );
}
