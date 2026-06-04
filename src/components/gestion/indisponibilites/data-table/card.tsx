import { Card, CardContent } from "@/components/ui/card";

import { formaterDateHeure } from "@/lib/dates";

import { IndisponibiliteRecherche } from "@/services/indisponibilite.service";

import { IndisponibiliteActions } from "./actions";

type Props = {
  indisponibilite: IndisponibiliteRecherche;
};

export function IndisponibiliteCard({ indisponibilite }: Props) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div>
          <h3 className="font-semibold">{indisponibilite.salle.nom}</h3>

          <p className="text-sm text-muted-foreground">
            Du {formaterDateHeure(indisponibilite.debut)}
          </p>

          <p className="text-sm text-muted-foreground">
            Au {formaterDateHeure(indisponibilite.fin)}
          </p>
        </div>

        {indisponibilite.motif && (
          <p className="text-sm">{indisponibilite.motif}</p>
        )}

        <IndisponibiliteActions indisponibilite={indisponibilite} />
      </CardContent>
    </Card>
  );
}
