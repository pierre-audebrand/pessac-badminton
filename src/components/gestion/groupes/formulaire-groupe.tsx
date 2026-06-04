"use client";

import { useActionState } from "react";

import type { GroupeFormState } from "@/actions/groupe.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  action: (
    state: GroupeFormState,
    formData: FormData,
  ) => Promise<GroupeFormState>;

  groupe?: {
    nom: string;
    description?: string | null;
    couleur?: string | null;
    ageMin?: number | null;
    ageMax?: number | null;
    actif?: boolean;
  };

  texteBouton: string;

  afficherActif?: boolean;
};

const initialState: GroupeFormState = {};

export function FormulaireGroupe({
  action,
  groupe,
  texteBouton,
  afficherActif = false,
}: Props) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="nom" required>
          Nom
        </Label>

        <Input id="nom" name="nom" required defaultValue={groupe?.nom} />

        {state.erreurs?.nom?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>

        <textarea
          id="description"
          name="description"
          defaultValue={groupe?.description ?? ""}
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />

        {state.erreurs?.description?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Couleur</Label>

        <Input
          id="couleur"
          name="couleur"
          type="color"
          defaultValue={groupe?.couleur ?? ""}
        />

        {state.erreurs?.description?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ageMin">Âge minimum</Label>

          <Input
            id="ageMin"
            name="ageMin"
            type="number"
            min={0}
            defaultValue={groupe?.ageMin ?? ""}
          />

          {state.erreurs?.ageMin?.map((erreur) => (
            <p key={erreur} className="text-sm text-destructive">
              {erreur}
            </p>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ageMax">Âge maximum</Label>

          <Input
            id="ageMax"
            name="ageMax"
            type="number"
            min={0}
            defaultValue={groupe?.ageMax ?? ""}
          />

          {state.erreurs?.ageMax?.map((erreur) => (
            <p key={erreur} className="text-sm text-destructive">
              {erreur}
            </p>
          ))}
        </div>
      </div>

      {afficherActif && (
        <div className="flex items-center gap-3">
          <input
            id="actif"
            name="actif"
            type="checkbox"
            defaultChecked={groupe?.actif}
            className="h-4 w-4"
          />

          <Label htmlFor="actif" className="cursor-pointer">
            Groupe actif
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
