import { z } from "zod";

export const modifierGroupesUtilisateurSchema = z.object({
  groupes: z.array(z.string()),
});

export type ModifierGroupesUtilisateurData = z.infer<
  typeof modifierGroupesUtilisateurSchema
>;
