import z from "zod";

export const modifierGroupesCreneauSchema = z.object({
  groupes: z.array(z.string()),
});

export type ModifierGroupesCreneauData = z.infer<
  typeof modifierGroupesCreneauSchema
>;
