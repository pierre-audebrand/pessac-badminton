import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { SalleRecherche } from "@/services/salle.service";

import { SalleActions } from "./actions";
import { formaterDate } from "@/lib/dates";

interface Props {
  salle: SalleRecherche;
}

export function SalleCard({ salle }: Props) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div>
          <div className="font-semibold">{salle.nom}</div>

          <div className="text-sm text-muted-foreground">{salle.ville}</div>
        </div>

        <div>
          {salle.actif ? (
            <Badge>Active</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          {salle._count.creneaux === 0
            ? "Aucun créneau"
            : `${salle._count.creneaux} créneau${salle._count.creneaux > 1 ? "x" : ""}`}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Indisponibilités à venir</p>

          {salle.indisponibilites.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune indisponibilité prévue
            </p>
          ) : (
            <div className="space-y-1">
              {salle.indisponibilites.slice(0, 3).map((indispo) => (
                <p key={indispo.id} className="text-sm">
                  {formaterDate(indispo.debut)}
                  {indispo.motif ? ` - ${indispo.motif}` : ""}
                </p>
              ))}
            </div>
          )}
        </div>

        <SalleActions salle={salle} />
      </CardContent>
    </Card>
  );
}
