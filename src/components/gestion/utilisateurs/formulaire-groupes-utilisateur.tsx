"use client";

import { useActionState } from "react";

import type { UtilisateurGroupesFormState } from "@/actions/groupe-utilisateur.actions";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { formaterTrancheAge } from "@/lib/groupes";
import { Badge } from "@/components/ui/badge";

type Props = {
  action: (
    state: UtilisateurGroupesFormState,
    formData: FormData,
  ) => Promise<UtilisateurGroupesFormState>;

  utilisateur: {
    groupes: string[];
  };

  groupes: {
    id: string;
    nom: string;
    description: string | null;
    ageMin: number | null;
    ageMax: number | null;
  }[];

  texteBouton: string;
};

const initialState: UtilisateurGroupesFormState = {};

export function FormulaireGroupesUtilisateur({
  action,
  utilisateur,
  groupes,
  texteBouton,
}: Props) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-6" noValidate>
      <div className="space-y-4">
        <Label>Groupes attribués</Label>

        <div className="space-y-3 rounded-lg border p-4">
          {groupes.length > 0 ? (
            groupes.map((groupe) => (
              <div key={groupe.id} className="flex items-center gap-3">
                <input
                  id={groupe.id}
                  name="groupes"
                  type="checkbox"
                  value={groupe.id}
                  defaultChecked={utilisateur.groupes.includes(groupe.id)}
                  className="h-4 w-4"
                />

                <div className="flex flex-wrap gap-2">
                  <Label htmlFor={groupe.id} className="cursor-pointer">
                    {groupe.nom}
                  </Label>

                  <Badge variant="outline">
                    {formaterTrancheAge(groupe.ageMin, groupe.ageMax)}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Aucun groupe disponible.
            </p>
          )}
        </div>

        {state.erreurs?.groupes?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      {state.message && (
        <p
          className={
            state.succes ? "text-sm text-green-600" : "text-sm text-destructive"
          }
        >
          {state.message}
        </p>
      )}

      <Button type="submit" className="cursor-pointer">
        {texteBouton}
      </Button>
    </form>
  );
}
