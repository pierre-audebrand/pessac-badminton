import { z } from "zod";
import { nullableStringSchema } from "./common.schemas";

export const creerRoleSchema = z.object({
  nom: z.string().trim().min(2, "Le nom est obligatoire"),

  description: nullableStringSchema(500),

  permissions: z.array(z.string()),
});

export const modifierRoleSchema = creerRoleSchema;

export type CreerRoleData = z.infer<typeof creerRoleSchema>;

export type ModifierRoleData = z.infer<typeof modifierRoleSchema>;
