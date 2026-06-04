import z from "zod";

export const creerSalleSchema = z.object({
  nom: z.string().trim().min(1, "Le nom est obligatoire").max(100),

  adresse: z.string().trim().min(1, "L'adresse est obligatoire").max(255),

  codePostal: z
    .string()
    .trim()
    .min(1, "Le code postal est obligatoire")
    .max(10),

  ville: z.string().trim().min(1, "La ville est obligatoire").max(100),
});

export const modifierSalleSchema = creerSalleSchema.extend({
  actif: z.boolean(),
});

export type CreerSalleData = z.infer<typeof creerSalleSchema>;

export type ModifierSalleData = z.infer<typeof modifierSalleSchema>;
