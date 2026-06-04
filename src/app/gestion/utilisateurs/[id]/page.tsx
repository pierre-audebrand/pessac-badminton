import Link from "next/link";
import { notFound } from "next/navigation";

import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/ui/page/page-section";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import { recupererUtilisateurParId } from "@/services/utilisateur.service";

import { calculerAge } from "@/lib/utilisateurs";
import { formaterDate } from "@/lib/dates";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UtilisateurPage({ params }: Props) {
  await exigerPermission(Permissions.UTILISATEURS_GERER.code);

  const { id } = await params;

  const utilisateur = await recupererUtilisateurParId(id);

  if (!utilisateur) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">
              {utilisateur.prenom} {utilisateur.nom}
            </h1>

            {utilisateur.actif ? (
              <Badge>Actif</Badge>
            ) : (
              <Badge variant="secondary">Inactif</Badge>
            )}
          </div>

          <p className="text-muted-foreground break-all">{utilisateur.email}</p>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          <Button asChild>
            <Link href={Routes.modifierUtilisateur(utilisateur.id)}>
              <Pencil className="h-4 w-4" />
              Modifier
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href={Routes.rolesUtilisateur(utilisateur.id)}>
              Gérer les rôles
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href={Routes.groupesUtilisateur(utilisateur.id)}>
              Gérer les groupes
            </Link>
          </Button>
        </div>
      </div>

      <PageSection title="Informations" className="space-y-3" bordered={false}>
        <div>
          <p className="text-sm text-muted-foreground">Prénom</p>

          <p>{utilisateur.prenom}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Nom</p>

          <p>{utilisateur.nom}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Date de naissance</p>

          <p>
            {utilisateur.dateNaissance
              ? formaterDate(utilisateur.dateNaissance)
              : "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Âge</p>

          <p>
            {utilisateur.dateNaissance
              ? `${calculerAge(utilisateur.dateNaissance)} ans`
              : "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Email</p>

          <p className="break-all">{utilisateur.email}</p>
        </div>
      </PageSection>

      <PageSection title="Groupes" bordered={false}>
        {utilisateur.groupes.length === 0 ? (
          <p className="text-muted-foreground">Aucun groupe attribué.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {utilisateur.groupes.map((utilisateurGroupe) => (
              <Link
                key={utilisateurGroupe.groupe.id}
                href={Routes.groupe(utilisateurGroupe.groupe.id)}
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary/80"
                >
                  {utilisateurGroupe.groupe.nom}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </PageSection>

      <PageSection title="Rôles" bordered={false}>
        {utilisateur.roles.length === 0 ? (
          <p className="text-muted-foreground">Aucun rôle attribué.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {utilisateur.roles.map((roleUtilisateur) => (
              <Link
                key={roleUtilisateur.role.id}
                href={Routes.role(roleUtilisateur.role.id)}
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary/80"
                >
                  {roleUtilisateur.role.nom}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </PageSection>
    </div>
  );
}
