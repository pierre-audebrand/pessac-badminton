import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

export const EMPTY_VALUE = "__none__";

export type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  value?: T;
  items: readonly Option<T>[];
  placeholder?: string;
  onValueChange?(value: T | undefined): void;

  emptyLabel?: string;
};

export function SelectOptions<T extends string>({
  value,
  items,
  placeholder = "Sélectionner un élément",
  onValueChange,
  emptyLabel,
}: Props<T>) {
  return (
    <Select
      value={value ?? EMPTY_VALUE}
      onValueChange={(value) =>
        onValueChange?.(value === EMPTY_VALUE ? undefined : (value as T))
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {emptyLabel && (
          <SelectItem value={EMPTY_VALUE}>{emptyLabel}</SelectItem>
        )}

        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
