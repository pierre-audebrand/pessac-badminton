import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { GroupeRecherche } from "@/services/groupe.service";

import { GroupeActions } from "./actions";
import { formaterDate } from "@/lib/dates";
import { formaterTrancheAge } from "@/lib/groupes";

interface Props {
  groupe: GroupeRecherche;
}

export function GroupeCard({ groupe }: Props) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div>
          <div className="font-semibold">{groupe.nom}</div>

          <div className="text-sm text-muted-foreground">
            {formaterTrancheAge(groupe.ageMin, groupe.ageMax)}
          </div>

          {groupe.description && (
            <div className="text-sm text-muted-foreground">
              {groupe.description}
            </div>
          )}
        </div>

        <div>
          {groupe.actif ? (
            <Badge>Actif</Badge>
          ) : (
            <Badge variant="secondary">Inactif</Badge>
          )}
        </div>

        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            {groupe._count.utilisateurs} utilisateur
            {groupe._count.utilisateurs > 1 ? "s" : ""}
          </p>

          <p>
            {groupe._count.creneaux} créneau
            {groupe._count.creneaux > 1 ? "x" : ""}
          </p>
        </div>

        <div className="text-sm text-muted-foreground">
          Créé le {formaterDate(groupe.createdAt)}
        </div>

        <GroupeActions groupe={groupe} />
      </CardContent>
    </Card>
  );
}
