"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";

import { recupererOccurrencesImpacteesAction } from "@/actions/indisponibilite.actions";

import { formaterDate } from "@/lib/dates";
import { joursSemaine } from "@/lib/jours-semaine";
import { OccurrenceCreneauImpactee } from "@/services/indisponibilite.service";

type Props = {
  salleId?: string;
  debut?: string;
  fin?: string;
};

export function ApercuCreneauxImpactes({ salleId, debut, fin }: Props) {
  const [loading, setLoading] = useState(false);

  const [occurrences, setOccurrences] = useState<OccurrenceCreneauImpactee[]>(
    [],
  );

  const formulaireComplet = Boolean(salleId) && Boolean(debut) && Boolean(fin);

  useEffect(() => {
    if (!formulaireComplet) {
      return;
    }

    const charger = async () => {
      setLoading(true);

      try {
        const resultat = await recupererOccurrencesImpacteesAction(
          salleId!,
          debut!,
          fin!,
        );

        setOccurrences(resultat);
      } finally {
        setLoading(false);
      }
    };

    void charger();
  }, [formulaireComplet, salleId, debut, fin]);

  if (!formulaireComplet) {
    return null;
  }

  const occurrencesAffichees = occurrences;

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-medium">Créneaux impactés</h3>

      {loading ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Analyse en cours...
        </p>
      ) : occurrencesAffichees.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Aucun créneau impacté.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted-foreground">
            Cette indisponibilité impacte {occurrencesAffichees.length} créneau
            {occurrencesAffichees.length > 1 ? "x" : ""}.
          </p>

          <ul className="mt-3 space-y-2">
            {occurrencesAffichees.map((occurrence) => (
              <li
                key={`${occurrence.creneau.id}-${occurrence.debut.toISOString()}`}
                className="text-sm"
              >
                • {joursSemaine[occurrence.creneau.jourSemaine].libelle}{" "}
                {formaterDate(occurrence.debut)}
                {" · "}
                {occurrence.creneau.heureDebut}
                {" → "}
                {occurrence.creneau.heureFin}
                {occurrence.creneau.groupes.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {occurrence.creneau.groupes.map(({ groupe }) => (
                      <Badge key={groupe.id} variant="outline">
                        {groupe.nom}
                      </Badge>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
