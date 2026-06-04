import { ChangeEventHandler } from "react";

type Props = {
  salles: {
    id: string;
    nom: string;
  }[];

  defaultValue?: string;
  required?: boolean;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
};

export function SelectSalle({
  salles,
  defaultValue,
  required = false,
  onChange,
}: Props) {
  return (
    <select
      id="salleId"
      name="salleId"
      defaultValue={defaultValue}
      required={required}
      onChange={onChange}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
    >
      <option value="">Sélectionner une salle</option>

      {salles.map((salle) => (
        <option key={salle.id} value={salle.id}>
          {salle.nom}
        </option>
      ))}
    </select>
  );
}
