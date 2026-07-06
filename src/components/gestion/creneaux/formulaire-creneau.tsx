"use client";

import { useActionState } from "react";

import type { CreneauFormState } from "@/actions/creneau.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JourSemaine, TypeCreneau } from "@prisma/client";
import { SelectEnum } from "@/components/ui/selects/select-enum";
import { joursSemaine } from "@/lib/jours-semaine";
import { typesCreneau } from "@/lib/types-creneau";
import { SelectOptions } from "@/components/ui/selects/select-options";
import { useSelectState } from "@/lib/use-select-state";

type Props = {
  action: (
    state: CreneauFormState,
    formData: FormData,
  ) => Promise<CreneauFormState>;

  salles: {
    id: string;
    nom: string;
  }[];

  creneau?: {
    salleId: string;
    jourSemaine: JourSemaine;
    type?: TypeCreneau | null;
    heureDebut: string;
    heureFin: string;
    actif?: boolean;
  };

  texteBouton: string;

  afficherActif?: boolean;
};

const initialState: CreneauFormState = {};

export function FormulaireCreneau({
  action,
  salles,
  creneau,
  texteBouton,
  afficherActif = false,
}: Props) {
  const [state, formAction] = useActionState(action, initialState);

  const [jourSemaine, setJourSemaine] = useSelectState(creneau?.jourSemaine);

  const [typeCreneau, setTypeCreneau] = useSelectState(creneau?.type);

  const [salleId, setSalleId] = useSelectState(creneau?.salleId);

  return (
    <form action={formAction} className="max-w-xl space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="salleId" required>
          Salle
        </Label>

        <input type="hidden" name="salleId" value={salleId ?? ""} />

        <SelectOptions
          value={salleId}
          onValueChange={setSalleId}
          items={salles.map((salle) => ({
            value: salle.id,
            label: salle.nom,
          }))}
          placeholder="Sélectionner une salle"
        />

        {state.erreurs?.salleId?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="jourSemaine" required>
          Jour
        </Label>

        <input type="hidden" name="jourSemaine" value={jourSemaine ?? ""} />

        <SelectEnum
          items={joursSemaine}
          value={jourSemaine}
          onValueChange={(value) => setJourSemaine(value)}
          placeholder="Sélectionner un jour"
        />

        {state.erreurs?.jourSemaine?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type" required>
          Type de créneau
        </Label>

        <input type="hidden" name="type" value={typeCreneau ?? ""} />

        <SelectEnum
          items={typesCreneau}
          value={typeCreneau}
          onValueChange={(value) => setTypeCreneau(value)}
          placeholder="Sélectionner un type"
        />

        {state.erreurs?.type?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="heureDebut" required>
          Heure de début
        </Label>

        <Input
          id="heureDebut"
          name="heureDebut"
          type="time"
          required
          defaultValue={creneau?.heureDebut}
        />

        {state.erreurs?.heureDebut?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="heureFin" required>
          Heure de fin
        </Label>

        <Input
          id="heureFin"
          name="heureFin"
          type="time"
          required
          defaultValue={creneau?.heureFin}
        />

        {state.erreurs?.heureFin?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      {afficherActif && (
        <div className="flex items-center gap-3">
          <input
            id="actif"
            name="actif"
            type="checkbox"
            defaultChecked={creneau?.actif}
            className="h-4 w-4"
          />

          <Label htmlFor="actif" className="cursor-pointer">
            Créneau actif
          </Label>
        </div>
      )}

      {state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" className="cursor-pointer">
        {texteBouton}
      </Button>
    </form>
  );
}
