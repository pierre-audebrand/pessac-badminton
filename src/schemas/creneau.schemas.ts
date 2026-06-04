import { JourSemaine, TypeCreneau } from "@prisma/client";
import z from "zod";
import { nullableEnumSchema } from "./common.schemas";

export const creerCreneauSchema = z
  .object({
    salleId: z.string().cuid("Salle invalide"),

    jourSemaine: z.enum(JourSemaine),

    heureDebut: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Heure invalide"),

    heureFin: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Heure invalide"),

    type: nullableEnumSchema(TypeCreneau),
  })
  .refine((data) => data.heureDebut < data.heureFin, {
    message: "L'heure de fin doit être postérieure à l'heure de début",
    path: ["heureFin"],
  });

export const modifierCreneauSchema = creerCreneauSchema.extend({
  actif: z.boolean(),
});

export type CreerCreneauData = z.infer<typeof creerCreneauSchema>;
export type ModifierCreneauData = z.infer<typeof modifierCreneauSchema>;
