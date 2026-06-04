import Link from "next/link";
import { notFound } from "next/navigation";

import { Pencil } from "lucide-react";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";
import { joursSemaine } from "@/lib/jours-semaine";
import { formaterDate, formaterDateHeure } from "@/lib/dates";

import { recupererCreneauParId } from "@/services/creneau.service";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/ui/page/page-section";
import { PageCardLink } from "@/components/ui/page/page-card-link";
import { formaterTrancheAge } from "@/lib/groupes";
import { listerProchainesOccurrencesCreneauAnnule } from "@/services/indisponibilite.service";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CreneauPage({ params }: Props) {
  await exigerPermission(Permissions.CRENEAUX_GERER.code);

  const { id } = await params;

  const creneau = await recupererCreneauParId(id);

  if (!creneau) {
    notFound();
  }

  const occurrencesImpactees = await listerProchainesOccurrencesCreneauAnnule(
    creneau.id,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">
              {joursSemaine[creneau.jourSemaine].libelle}
            </h1>

            {creneau.actif ? (
              <Badge>Actif</Badge>
            ) : (
              <Badge variant="secondary">Inactif</Badge>
            )}
          </div>

          <p className="text-muted-foreground">
            {creneau.heureDebut} → {creneau.heureFin}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          <Button asChild>
            <Link href={Routes.modifierCreneau(creneau.id)}>
              <Pencil className="h-4 w-4" />
              Modifier
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href={Routes.groupesCreneau(creneau.id)}>
              Gérer les groupes
            </Link>
          </Button>
        </div>
      </div>

      <PageSection title="Informations" className="space-y-3" bordered={false}>
        <div>
          <p className="text-sm text-muted-foreground">Jour</p>
          <p>{joursSemaine[creneau.jourSemaine].libelle}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Heure de début</p>
          <p>{creneau.heureDebut}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Heure de fin</p>
          <p>{creneau.heureFin}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Créé le</p>
          <p>{formaterDate(creneau.createdAt)}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Modifié le</p>
          <p>{formaterDate(creneau.updatedAt)}</p>
        </div>
      </PageSection>

      <PageSection title="Salle" bordered={false}>
        <PageCardLink href={Routes.salle(creneau.salle.id)}>
          <div className="font-medium">{creneau.salle.nom}</div>

          <div className="text-sm text-muted-foreground">
            {creneau.salle.adresse}
          </div>

          <div className="text-sm text-muted-foreground">
            {creneau.salle.codePostal} {creneau.salle.ville}
          </div>
        </PageCardLink>
      </PageSection>

      <PageSection title="Groupes associés" bordered={false}>
        {creneau.groupes.length === 0 ? (
          <p className="text-muted-foreground">Aucun groupe associé.</p>
        ) : (
          <div className="space-y-2">
            {creneau.groupes.map((groupeCreneau) => (
              <PageCardLink
                key={groupeCreneau.groupeId}
                href={Routes.groupe(groupeCreneau.groupe.id)}
              >
                <div className="font-medium">{groupeCreneau.groupe.nom}</div>

                {(groupeCreneau.groupe.ageMin != null ||
                  groupeCreneau.groupe.ageMax != null) && (
                  <div className="text-sm text-muted-foreground">
                    {formaterTrancheAge(
                      groupeCreneau.groupe.ageMin,
                      groupeCreneau.groupe.ageMax,
                    )}
                  </div>
                )}

                {groupeCreneau.groupe.description && (
                  <div className="text-sm text-muted-foreground">
                    {groupeCreneau.groupe.description}
                  </div>
                )}
              </PageCardLink>
            ))}
          </div>
        )}
      </PageSection>

      <PageSection
        title={`Prochains créneaux annulés (${occurrencesImpactees.length})`}
        bordered={false}
      >
        {occurrencesImpactees.length === 0 ? (
          <p className="text-muted-foreground">
            Aucune occurrence impactée à venir.
          </p>
        ) : (
          <div className="space-y-2">
            {occurrencesImpactees.map(({ occurrence, indisponibilite }) => (
              <div
                key={`${indisponibilite.id}-${occurrence.debut.toISOString()}`}
                className="rounded-lg border p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-medium">
                    {formaterDate(occurrence.debut)} ·{" "}
                    {occurrence.debut.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" → "}
                    {occurrence.fin.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  {occurrence.creneau.groupes.map(({ groupe }) => (
                    <Badge key={groupe.id} variant="outline">
                      {groupe.nom}
                    </Badge>
                  ))}
                </div>

                <div className="mt-2 text-sm text-muted-foreground">
                  {indisponibilite.motif ?? "Indisponibilité de la salle"}
                  {" — "}
                  {formaterDateHeure(indisponibilite.debut)}
                  {" → "}
                  {formaterDateHeure(indisponibilite.fin)}
                </div>
              </div>
            ))}
          </div>
        )}
      </PageSection>
    </div>
  );
}
