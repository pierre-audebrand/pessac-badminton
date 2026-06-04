"use client";

import { useActionState } from "react";

import type { SalleFormState } from "@/actions/salle.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  action: (
    state: SalleFormState,
    formData: FormData,
  ) => Promise<SalleFormState>;

  salle?: {
    nom: string;
    adresse: string;
    codePostal: string;
    ville: string;
    actif?: boolean;
  };

  texteBouton: string;

  afficherActif?: boolean;
};

const initialState: SalleFormState = {};

export function FormulaireSalle({
  action,
  salle,
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

        <Input id="nom" name="nom" required defaultValue={salle?.nom} />

        {state.erreurs?.nom?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="adresse" required>
          Adresse
        </Label>

        <Input
          id="adresse"
          name="adresse"
          required
          defaultValue={salle?.adresse}
        />

        {state.erreurs?.adresse?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="codePostal" required>
          Code postal
        </Label>

        <Input
          id="codePostal"
          name="codePostal"
          required
          defaultValue={salle?.codePostal}
        />

        {state.erreurs?.codePostal?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ville" required>
          Ville
        </Label>

        <Input id="ville" name="ville" required defaultValue={salle?.ville} />

        {state.erreurs?.ville?.map((erreur) => (
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
            defaultChecked={salle?.actif}
            className="h-4 w-4"
          />

          <Label htmlFor="actif" className="cursor-pointer">
            Salle active
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
