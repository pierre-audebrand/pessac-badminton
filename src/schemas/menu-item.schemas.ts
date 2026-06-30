import { z } from "zod";

import { Menu, TypeMenuItem } from "@prisma/client";

import { nullableStringSchema } from "./common.schemas";

export const creerMenuItemSchema = z
  .object({
    menu: z.enum(Menu),

    parentId: nullableStringSchema(),

    libelle: z.string().trim().min(1).max(100),

    type: z.enum(TypeMenuItem),

    pageId: nullableStringSchema(),

    url: nullableStringSchema(500).refine(
      (value) => !value || URL.canParse(value),
      "L'URL est invalide.",
    ),

    ordre: z.coerce.number().int().min(0),

    nouvelOnglet: z.boolean(),

    actif: z.boolean(),
  })
  .superRefine((data, ctx) => {
    switch (data.type) {
      case TypeMenuItem.PAGE: {
        if (!data.pageId) {
          ctx.addIssue({
            code: "custom",
            path: ["pageId"],
            message: "Veuillez sélectionner une page.",
          });
        }

        if (data.url) {
          ctx.addIssue({
            code: "custom",
            path: ["url"],
            message: "Une page ne peut pas avoir d'URL personnalisée.",
          });
        }

        if (data.nouvelOnglet) {
          ctx.addIssue({
            code: "custom",
            path: ["nouvelOnglet"],
            message: "Cette option est disponible uniquement pour les URL.",
          });
        }

        break;
      }

      case TypeMenuItem.URL: {
        if (!data.url) {
          ctx.addIssue({
            code: "custom",
            path: ["url"],
            message: "Veuillez saisir une URL.",
          });
        }

        if (data.pageId) {
          ctx.addIssue({
            code: "custom",
            path: ["pageId"],
            message: "Une URL ne peut pas être liée à une page.",
          });
        }

        break;
      }

      case TypeMenuItem.GROUPE: {
        if (data.pageId) {
          ctx.addIssue({
            code: "custom",
            path: ["pageId"],
            message: "Un groupe ne peut pas être lié à une page.",
          });
        }

        if (data.url) {
          ctx.addIssue({
            code: "custom",
            path: ["url"],
            message: "Un groupe ne peut pas avoir d'URL.",
          });
        }

        break;
      }
    }
  });

export const modifierMenuItemSchema = creerMenuItemSchema;

export type CreerMenuItemData = z.infer<typeof creerMenuItemSchema>;
export type ModifierMenuItemData = z.infer<typeof modifierMenuItemSchema>;
