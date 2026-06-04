"use client";

import { useActionState } from "react";

import type { UtilisateurFormState } from "@/actions/utilisateur.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  action: (
    state: UtilisateurFormState,
    formData: FormData,
  ) => Promise<UtilisateurFormState>;

  utilisateur?: {
    prenom: string;
    nom: string;
    dateNaissance?: string | null;
    email: string;
    actif?: boolean;
  };

  texteBouton: string;

  afficherMotDePasse?: boolean;
  afficherActif?: boolean;
};

const initialState: UtilisateurFormState = {};

export function FormulaireUtilisateur({
  action,
  utilisateur,
  texteBouton,
  afficherMotDePasse = false,
  afficherActif = false,
}: Props) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="prenom" required>
          Prénom
        </Label>

        <Input
          id="prenom"
          name="prenom"
          required
          defaultValue={utilisateur?.prenom}
        />

        {state.erreurs?.prenom?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="nom" required>
          Nom
        </Label>

        <Input id="nom" name="nom" required defaultValue={utilisateur?.nom} />

        {state.erreurs?.nom?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateNaissance">Date de naissance</Label>

        <Input
          id="dateNaissance"
          name="dateNaissance"
          type="date"
          defaultValue={utilisateur?.dateNaissance ?? ""}
        />

        {state.erreurs?.dateNaissance?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" required>
          Email
        </Label>

        <Input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={utilisateur?.email}
        />

        {state.erreurs?.email?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      {afficherMotDePasse && (
        <div className="space-y-2">
          <Label htmlFor="motDePasse">Mot de passe</Label>

          <Input
            id="motDePasse"
            name="motDePasse"
            type="password"
            autoComplete="new-password"
          />

          {state.erreurs?.motDePasse?.map((erreur) => (
            <p key={erreur} className="text-sm text-destructive">
              {erreur}
            </p>
          ))}
        </div>
      )}

      {afficherActif && (
        <div className="flex items-center gap-3">
          <input
            id="actif"
            name="actif"
            type="checkbox"
            defaultChecked={utilisateur?.actif}
            className="h-4 w-4"
          />

          <Label htmlFor="actif" className="cursor-pointer">
            Compte actif
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
