import { joursSemaine } from "@/lib/jours-semaine";

type Props = {
  id?: string;
  name?: string;
  defaultValue?: string;
  required?: boolean;
};

export function SelectJourSemaine({
  id = "jourSemaine",
  name = "jourSemaine",
  defaultValue,
  required = false,
}: Props) {
  return (
    <select
      id={id}
      name={name}
      defaultValue={defaultValue}
      required={required}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
    >
      <option value="">Sélectionner un jour</option>

      {Object.entries(joursSemaine).map(([code, jour]) => (
        <option key={code} value={code}>
          {jour.libelle}
        </option>
      ))}
    </select>
  );
}
