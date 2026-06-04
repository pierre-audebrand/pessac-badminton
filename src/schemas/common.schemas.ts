import { z } from "zod";

export function nullableStringSchema(max?: number) {
  return z.preprocess(
    (value) => {
      if (value == null) {
        return null;
      }

      const texte = String(value).trim();

      return texte === "" ? null : texte;
    },
    max !== undefined
      ? z.string().trim().max(max).nullable()
      : z.string().trim().nullable(),
  );
}

export const nullableDateSchema = z.preprocess((value) => {
  if (!value || value === "") {
    return null;
  }

  return new Date(String(value));
}, z.date().nullable());

const ageSchema = z.coerce.number().int().min(0).max(120);

export const nullableAgeSchema = z.preprocess((value) => {
  if (value == null || value === "") {
    return null;
  }

  return Number(value);
}, ageSchema.nullable());

export function nullableEnumSchema<T extends Record<string, string>>(
  enumObject: T,
) {
  return z.preprocess(
    (value) => (value === "" ? null : value),
    z.enum(enumObject).nullable(),
  );
}
