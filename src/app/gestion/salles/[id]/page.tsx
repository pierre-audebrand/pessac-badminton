import Link from "next/link";
import { notFound } from "next/navigation";

import { CalendarX2, Pencil } from "lucide-react";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";
import { formaterDate, formaterDateHeure } from "@/lib/dates";

import { recupererSalleParId } from "@/services/salle.service";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/ui/page/page-section";
import { PageCardLink } from "@/components/ui/page/page-card-link";
import { typesCreneau } from "@/lib/types-creneau";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SallePage({ params }: Props) {
  await exigerPermission(Permissions.SALLES_GERER.code);

  const { id } = await params;

  const salle = await recupererSalleParId(id);

  if (!salle) {
    notFound();
  }

  const indisponibilitesFutures = salle.indisponibilites;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{salle.nom}</h1>

            {salle.actif ? (
              <Badge>Active</Badge>
            ) : (
              <Badge variant="secondary">Inactive</Badge>
            )}
          </div>

          <p className="text-muted-foreground">
            {salle.adresse}
            <br />
            {salle.codePostal} {salle.ville}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          <Button asChild>
            <Link href={Routes.modifierSalle(salle.id)}>
              <Pencil className="h-4 w-4" />
              Modifier
            </Link>
          </Button>

          <Button asChild>
            <Link
              href={`${Routes.GESTION_INDISPONIBILITES_CREER}?salleId=${salle.id}`}
            >
              <CalendarX2 className="h-4 w-4" />
              Ajouter une indisponibilité
            </Link>
          </Button>
        </div>
      </div>

      <PageSection title="Informations" className="space-y-3" bordered={false}>
        <div>
          <p className="text-sm text-muted-foreground">Nom</p>
          <p>{salle.nom}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Adresse</p>
          <p>{salle.adresse}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Code postal</p>
          <p>{salle.codePostal}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Ville</p>
          <p>{salle.ville}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Créée le</p>
          <p>{formaterDate(salle.createdAt)}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Modifiée le</p>
          <p>{formaterDate(salle.updatedAt)}</p>
        </div>
      </PageSection>

      <PageSection title="Créneaux" bordered={false}>
        {salle.creneaux.length === 0 ? (
          <p className="text-muted-foreground">Aucun créneau associé.</p>
        ) : (
          <div className="space-y-2">
            {salle.creneaux.map((creneau) => (
              <PageCardLink key={creneau.id} href={Routes.creneau(creneau.id)}>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">
                      {creneau.jourSemaine} · {creneau.heureDebut} →{" "}
                      {creneau.heureFin}
                    </span>

                    {creneau.type && (
                      <Badge variant="secondary">
                        {typesCreneau[creneau.type].libelle}
                      </Badge>
                    )}
                  </div>

                  {creneau.groupes.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {creneau.groupes.map(({ groupe }) => (
                        <Badge key={groupe.id} variant="outline">
                          {groupe.nom}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </PageCardLink>
            ))}
          </div>
        )}
      </PageSection>

      <PageSection title="Indisponibilités futures" bordered={false}>
        {indisponibilitesFutures.length === 0 ? (
          <p className="text-muted-foreground">
            Aucune indisponibilité à venir.
          </p>
        ) : (
          <div className="space-y-2">
            {indisponibilitesFutures.map((indisponibilite) => (
              <div key={indisponibilite.id} className="rounded-lg border p-4">
                <div>Du {formaterDateHeure(indisponibilite.debut)}</div>

                <div>Au {formaterDateHeure(indisponibilite.fin)}</div>

                {indisponibilite.motif && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {indisponibilite.motif}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </PageSection>
    </div>
  );
}
