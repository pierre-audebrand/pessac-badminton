import z from "zod";
import { nullableAgeSchema, nullableStringSchema } from "./common.schemas";

export const creerGroupeSchema = z
  .object({
    nom: z.string().trim().min(1, "Le nom est obligatoire").max(100),

    description: nullableStringSchema(500),

    couleur: nullableStringSchema(7),

    ageMin: nullableAgeSchema,

    ageMax: nullableAgeSchema,
  })
  .refine(
    (data) =>
      data.ageMin == null || data.ageMax == null || data.ageMin <= data.ageMax,
    {
      path: ["ageMax"],
      message: "L'âge maximum doit être supérieur ou égal à l'âge minimum",
    },
  );

export const modifierGroupeSchema = creerGroupeSchema.extend({
  actif: z.boolean(),
});

export type CreerGroupeData = z.infer<typeof creerGroupeSchema>;

export type ModifierGroupeData = z.infer<typeof modifierGroupeSchema>;
