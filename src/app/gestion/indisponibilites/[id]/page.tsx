import Link from "next/link";
import { notFound } from "next/navigation";

import { Pencil } from "lucide-react";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import { formaterDate, formaterDateHeure } from "@/lib/dates";

import {
  recupererIndisponibiliteParId,
  listerOccurrencesCreneauImpactees,
} from "@/services/indisponibilite.service";

import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/ui/page/page-section";
import { Badge } from "@/components/ui/badge";
import { joursSemaine } from "@/lib/jours-semaine";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function IndisponibilitePage({ params }: Props) {
  await exigerPermission(Permissions.SALLES_GERER.code);

  const { id } = await params;

  const indisponibilite = await recupererIndisponibiliteParId(id);

  if (!indisponibilite) {
    notFound();
  }

  const occurrencesImpactees = await listerOccurrencesCreneauImpactees(
    indisponibilite.salleId,
    indisponibilite.debut,
    indisponibilite.fin,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Indisponibilité</h1>

          <p className="text-muted-foreground">{indisponibilite.salle.nom}</p>
        </div>

        <Button asChild>
          <Link href={Routes.modifierIndisponibilite(indisponibilite.id)}>
            <Pencil className="h-4 w-4" />
            Modifier
          </Link>
        </Button>
      </div>

      <PageSection title="Informations" bordered={false} className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Salle</p>

          <p>{indisponibilite.salle.nom}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Début</p>

          <p>{formaterDateHeure(indisponibilite.debut)}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Fin</p>

          <p>{formaterDateHeure(indisponibilite.fin)}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Motif</p>

          <p>{indisponibilite.motif || "Aucun motif renseigné"}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Créée le</p>

          <p>{formaterDate(indisponibilite.createdAt)}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Modifiée le</p>

          <p>{formaterDate(indisponibilite.updatedAt)}</p>
        </div>
      </PageSection>

      <PageSection
        title={`Créneaux impactés (${occurrencesImpactees.length})`}
        bordered={false}
      >
        {occurrencesImpactees.length === 0 ? (
          <p className="text-muted-foreground">Aucun créneau impacté.</p>
        ) : (
          <div className="space-y-2">
            {occurrencesImpactees.map((occurrence, index) => (
              <div
                key={`${occurrence.creneau.id}-${occurrence.debut.toISOString()}-${index}`}
                className="rounded-lg border p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">
                    {joursSemaine[occurrence.creneau.jourSemaine].libelle}{" "}
                    {occurrence.debut.toLocaleDateString("fr-FR")} ·{" "}
                    {occurrence.creneau.heureDebut} →{" "}
                    {occurrence.creneau.heureFin}
                  </span>

                  {occurrence.creneau.groupes.map(({ groupe }) => (
                    <Badge key={groupe.id} variant="outline">
                      {groupe.nom}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </PageSection>
    </div>
  );
}
