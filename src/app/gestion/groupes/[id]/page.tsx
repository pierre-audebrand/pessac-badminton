import Link from "next/link";
import { notFound } from "next/navigation";

import { Pencil } from "lucide-react";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";
import { formaterDate } from "@/lib/dates";
import { formaterTrancheAge } from "@/lib/groupes";

import { recupererGroupeParId } from "@/services/groupe.service";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/ui/page/page-section";
import { PageCardLink } from "@/components/ui/page/page-card-link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GroupePage({ params }: Props) {
  await exigerPermission(Permissions.GROUPES_GERER.code);

  const { id } = await params;

  const groupe = await recupererGroupeParId(id);

  if (!groupe) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{groupe.nom}</h1>

            {groupe.actif ? (
              <Badge>Actif</Badge>
            ) : (
              <Badge variant="secondary">Inactif</Badge>
            )}
          </div>

          <p className="text-muted-foreground">
            {groupe.description || "Aucune description"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          <Button asChild>
            <Link href={Routes.modifierGroupe(groupe.id)}>
              <Pencil className="h-4 w-4" />
              Modifier
            </Link>
          </Button>
        </div>
      </div>

      <PageSection title="Informations" className="space-y-3" bordered={false}>
        <div>
          <p className="text-sm text-muted-foreground">Nom</p>

          <p>{groupe.nom}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{"Tranche d'âge"}</p>

          <p>{formaterTrancheAge(groupe.ageMin, groupe.ageMax)}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Description</p>

          <p>{groupe.description || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Créé le</p>

          <p>{formaterDate(groupe.createdAt)}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Modifié le</p>

          <p>{formaterDate(groupe.updatedAt)}</p>
        </div>
      </PageSection>

      <PageSection title="Utilisateurs associés" bordered={false}>
        {groupe.utilisateurs.length === 0 ? (
          <p className="text-muted-foreground">Aucun utilisateur associé.</p>
        ) : (
          <div className="space-y-2">
            {groupe.utilisateurs.map(({ utilisateur }) => (
              <PageCardLink
                key={utilisateur.id}
                href={Routes.utilisateur(utilisateur.id)}
              >
                <div className="font-medium">
                  {utilisateur.prenom} {utilisateur.nom}
                </div>

                <div className="text-sm text-muted-foreground">
                  {utilisateur.email}
                </div>
              </PageCardLink>
            ))}
          </div>
        )}
      </PageSection>

      <PageSection title="Créneaux associés" bordered={false}>
        {groupe.creneaux.length === 0 ? (
          <p className="text-muted-foreground">Aucun créneau associé.</p>
        ) : (
          <div className="space-y-2">
            {groupe.creneaux.map(({ creneau }) => (
              <PageCardLink key={creneau.id} href={Routes.creneau(creneau.id)}>
                <div>
                  {creneau.jourSemaine} · {creneau.heureDebut} →{" "}
                  {creneau.heureFin}
                </div>

                <div className="text-sm text-muted-foreground">
                  {creneau.salle.nom}
                </div>
              </PageCardLink>
            ))}
          </div>
        )}
      </PageSection>
    </div>
  );
}
