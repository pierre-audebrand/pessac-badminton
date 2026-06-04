import { z } from "zod";
import { nullableDateSchema } from "./common.schemas";

export const creerUtilisateurSchema = z.object({
  prenom: z.string().min(1, "Le prénom est obligatoire"),
  nom: z.string().min(1, "Le nom est obligatoire"),
  dateNaissance: nullableDateSchema,
  email: z.email("Email invalide"),
  motDePasse: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export type CreerUtilisateurData = z.infer<typeof creerUtilisateurSchema>;

export const modifierUtilisateurSchema = z.object({
  prenom: z.string().trim().min(1, "Le prénom est obligatoire"),
  nom: z.string().trim().min(1, "Le nom est obligatoire"),
  dateNaissance: nullableDateSchema,
  email: z.email("Email invalide"),
  actif: z.boolean(),
});

export type ModifierUtilisateurData = z.infer<typeof modifierUtilisateurSchema>;

export const modifierMotDePasseSchema = z
  .object({
    motDePasse: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),

    confirmationMotDePasse: z.string(),
  })
  .refine((data) => data.motDePasse === data.confirmationMotDePasse, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmationMotDePasse"],
  });

export type ModifierMotDePasseData = z.infer<typeof modifierMotDePasseSchema>;
