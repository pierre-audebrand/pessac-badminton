import { z } from "zod";

export const modifierRolesUtilisateurSchema = z.object({
  roles: z.array(z.string()),
});
