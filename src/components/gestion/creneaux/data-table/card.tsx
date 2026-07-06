import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { joursSemaine } from "@/lib/jours-semaine";

import { CreneauRecherche } from "@/services/creneau.service";

import { CreneauActions } from "./actions";
import { typesCreneau } from "@/lib/types-creneau";
import { getContrastColor } from "@/lib/colors";

interface Props {
  creneau: CreneauRecherche;
}

export function CreneauCard({ creneau }: Props) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div>
          <div className="font-semibold">
            {joursSemaine[creneau.jourSemaine].libelle}
          </div>

          <div className="text-sm text-muted-foreground">
            {creneau.heureDebut} - {creneau.heureFin}
          </div>
        </div>

        <div>
          <p className="text-sm">{creneau.salle.nom}</p>
        </div>

        <div>
          {creneau.groupes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun groupe</p>
          ) : (
            <div className="flex flex-wrap gap-1">
              {creneau.groupes.map(({ groupe }) => (
                <Badge
                  key={groupe.id}
                  variant="outline"
                  style={{
                    backgroundColor: groupe.couleur ?? undefined,
                    borderColor: groupe.couleur ?? undefined,
                    color: groupe.couleur
                      ? getContrastColor(groupe.couleur)
                      : undefined,
                  }}
                >
                  {groupe.nom}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {creneau.type && (
            <Badge variant="outline">
              {typesCreneau[creneau.type].libelle}
            </Badge>
          )}

          {creneau.actif ? (
            <Badge>Actif</Badge>
          ) : (
            <Badge variant="secondary">Inactif</Badge>
          )}
        </div>

        <CreneauActions creneau={creneau} />
      </CardContent>
    </Card>
  );
}
