import { Option, SelectOptions } from "./select-options";

type Props<T extends string, U extends { libelle: string }> = {
  value?: T;
  items: Record<T, U>;
  placeholder?: string;
  onValueChange?(value: T): void;
};

export function SelectEnum<T extends string, U extends { libelle: string }>({
  items,
  ...props
}: Props<T, U>) {
  const optionItems: Option<T>[] = (Object.keys(items) as T[]).map((value) => ({
    value,
    label: items[value].libelle,
  }));

  return <SelectOptions {...props} items={optionItems} />;
}
