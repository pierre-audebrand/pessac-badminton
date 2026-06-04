"use client";

import { useActionState, useState } from "react";

import type { IndisponibiliteFormState } from "@/actions/indisponibilite.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectSalle } from "@/components/ui/selects/select-salle";

import { ApercuCreneauxImpactes } from "./apercu-creneaux-impactes";

type Props = {
  action: (
    state: IndisponibiliteFormState,
    formData: FormData,
  ) => Promise<IndisponibiliteFormState>;

  salles: {
    id: string;
    nom: string;
  }[];

  indisponibilite?: {
    salleId?: string;
    debut?: string;
    fin?: string;
    motif?: string | null;
  };

  texteBouton: string;
};

const initialState: IndisponibiliteFormState = {};

export function FormulaireIndisponibilite({
  action,
  salles,
  indisponibilite,
  texteBouton,
}: Props) {
  const [state, formAction] = useActionState(action, initialState);

  const [salleId, setSalleId] = useState(indisponibilite?.salleId ?? "");

  const [debut, setDebut] = useState(indisponibilite?.debut ?? "");

  const [fin, setFin] = useState(indisponibilite?.fin ?? "");

  return (
    <form action={formAction} className="max-w-xl space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="salleId" required>
          Salle
        </Label>

        <SelectSalle
          salles={salles}
          defaultValue={indisponibilite?.salleId}
          required
          onChange={(e) => setSalleId(e.target.value)}
        />

        {state.erreurs?.salleId?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="debut" required>
          Début
        </Label>

        <Input
          id="debut"
          name="debut"
          type="datetime-local"
          required
          defaultValue={indisponibilite?.debut}
          onChange={(e) => setDebut(e.target.value)}
        />

        {state.erreurs?.debut?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fin" required>
          Fin
        </Label>

        <Input
          id="fin"
          name="fin"
          type="datetime-local"
          required
          defaultValue={indisponibilite?.fin}
          onChange={(e) => setFin(e.target.value)}
        />

        {state.erreurs?.fin?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="motif">Motif</Label>

        <Input
          id="motif"
          name="motif"
          defaultValue={indisponibilite?.motif ?? ""}
          maxLength={255}
        />

        {state.erreurs?.motif?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <ApercuCreneauxImpactes salleId={salleId} debut={debut} fin={fin} />

      {state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" className="cursor-pointer">
        {texteBouton}
      </Button>
    </form>
  );
}
