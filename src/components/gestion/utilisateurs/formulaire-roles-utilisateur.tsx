"use client";

import { useActionState } from "react";

import { UtilisateurRolesFormState } from "@/actions/role-utilisateur.actions";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Props = {
  action: (
    state: UtilisateurRolesFormState,
    formData: FormData,
  ) => Promise<UtilisateurRolesFormState>;

  utilisateur: {
    roles: string[];
  };

  roles: {
    id: string;
    nom: string;
    description: string | null;
  }[];

  texteBouton: string;
};

const initialState: UtilisateurRolesFormState = {};

export function FormulaireRolesUtilisateur({
  action,
  utilisateur,
  roles,
  texteBouton,
}: Props) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-6" noValidate>
      <div className="space-y-4">
        <Label>Rôles attribués</Label>

        <div className="space-y-3 rounded-lg border p-4">
          {roles.length > 0 ? (
            roles.map((role) => (
              <div key={role.id} className="flex items-center gap-3">
                <input
                  id={role.id}
                  name="roles"
                  type="checkbox"
                  value={role.id}
                  defaultChecked={utilisateur.roles.includes(role.id)}
                  className="h-4 w-4"
                />

                <div>
                  <Label htmlFor={role.id} className="cursor-pointer">
                    {role.nom}
                  </Label>

                  {role.description && (
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Aucun rôle disponible.
            </p>
          )}
        </div>

        {state.erreurs?.roles?.map((erreur) => (
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
