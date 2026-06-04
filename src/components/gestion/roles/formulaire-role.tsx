"use client";

import { useActionState } from "react";

import type { RoleFormState } from "@/actions/role.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Permission = {
  id: string;
  libelle: string;
};

type Props = {
  action: (state: RoleFormState, formData: FormData) => Promise<RoleFormState>;

  role?: {
    nom: string;
    description: string | null;
    permissions: string[];
  };

  permissions: Permission[];

  texteBouton: string;
};

const initialState: RoleFormState = {};

export function FormulaireRole({
  action,
  role,
  permissions,
  texteBouton,
}: Props) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="nom" required>
          Nom
        </Label>

        <Input id="nom" name="nom" required defaultValue={role?.nom} />

        {state.erreurs?.nom?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>

        <Input
          id="description"
          name="description"
          defaultValue={role?.description ?? ""}
        />

        {state.erreurs?.description?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-3">
        <Label>Permissions</Label>

        <div className="space-y-2 rounded-lg border p-4">
          {permissions.map((permission) => (
            <div key={permission.id} className="flex items-center gap-3">
              <input
                id={`permission-${permission.id}`}
                type="checkbox"
                name="permissions"
                value={permission.id}
                defaultChecked={role?.permissions.includes(permission.id)}
                className="h-4 w-4"
              />

              <Label
                htmlFor={`permission-${permission.id}`}
                className="cursor-pointer"
              >
                {permission.libelle}
              </Label>
            </div>
          ))}
        </div>

        {state.erreurs?.permissions?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      {state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" className="cursor-pointer">
        {texteBouton}
      </Button>
    </form>
  );
}
