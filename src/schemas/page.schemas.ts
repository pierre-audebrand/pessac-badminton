import { z } from "zod";
import { nullableStringSchema } from "./common.schemas";

export const creerPageSchema = z.object({
  titre: z.string().trim().min(1).max(100),

  chemin: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9/-]*$/, "Le chemin est invalide"),

  seoTitre: nullableStringSchema(60),

  seoDescription: nullableStringSchema(160),

  publiee: z.boolean(),
});

export const modifierPageSchema = creerPageSchema;

export type CreerPageData = z.infer<typeof creerPageSchema>;
export type ModifierPageData = z.infer<typeof modifierPageSchema>;
