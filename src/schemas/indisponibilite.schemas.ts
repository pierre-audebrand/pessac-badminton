import z from "zod";
import { nullableStringSchema } from "./common.schemas";

export const creerIndisponibiliteSchema = z
  .object({
    salleId: z.string().min(1, "La salle est obligatoire"),

    debut: z.coerce.date({
      error: "La date de début est obligatoire",
    }),

    fin: z.coerce.date({
      error: "La date de fin est obligatoire",
    }),

    motif: nullableStringSchema(255),
  })
  .refine((data) => data.fin > data.debut, {
    path: ["fin"],
    message: "La date de fin doit être postérieure à la date de début",
  });

export const modifierIndisponibiliteSchema = creerIndisponibiliteSchema;

export type CreerIndisponibiliteData = z.infer<
  typeof creerIndisponibiliteSchema
>;

export type ModifierIndisponibiliteData = z.infer<
  typeof modifierIndisponibiliteSchema
>;
