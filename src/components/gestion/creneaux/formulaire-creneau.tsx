"use client";

import { useActionState } from "react";

import type { CreneauFormState } from "@/actions/creneau.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectSalle } from "@/components/ui/selects/select-salle";
import { SelectJourSemaine } from "@/components/ui/selects/select-jour-semaine";
import { SelectTypeCreneau } from "@/components/ui/selects/select-type-creneau";
import { TypeCreneau } from "@prisma/client";

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
    jourSemaine:
      | "LUNDI"
      | "MARDI"
      | "MERCREDI"
      | "JEUDI"
      | "VENDREDI"
      | "SAMEDI"
      | "DIMANCHE";
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

  return (
    <form action={formAction} className="max-w-xl space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="salleId" required>
          Salle
        </Label>

        <SelectSalle salles={salles} defaultValue={creneau?.salleId} required />

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

        <SelectJourSemaine defaultValue={creneau?.jourSemaine} required />

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

        <SelectTypeCreneau defaultValue={creneau?.type} />

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
