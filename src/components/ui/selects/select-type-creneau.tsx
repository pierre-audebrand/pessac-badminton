import { TypeCreneau } from "@prisma/client";

import { typesCreneau } from "@/lib/types-creneau";

type Props = {
  id?: string;
  name?: string;
  defaultValue?: TypeCreneau | null;
  required?: boolean;
};

export function SelectTypeCreneau({
  id = "type",
  name = "type",
  defaultValue,
  required = false,
}: Props) {
  return (
    <select
      id={id}
      name={name}
      defaultValue={defaultValue ?? ""}
      required={required}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
    >
      <option value="">Sélectionner un type</option>

      {Object.entries(typesCreneau).map(([code, type]) => (
        <option key={code} value={code}>
          {type.libelle}
        </option>
      ))}
    </select>
  );
}
