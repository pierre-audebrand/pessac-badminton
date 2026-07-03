import { z } from "zod";

import { Menu } from "@prisma/client";

import { nullableStringSchema } from "./common.schemas";

export const creerMenuItemSchema = z
  .object({
    menu: z.enum(Menu),

    parentId: nullableStringSchema(),

    libelle: z.string().trim().min(1).max(100),

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
    const hasPage = !!data.pageId;
    const hasUrl = !!data.url;

    if (hasPage && hasUrl) {
      ctx.addIssue({
        code: "custom",
        path: ["pageId"],
        message: "Choisissez une page ou une URL.",
      });

      ctx.addIssue({
        code: "custom",
        path: ["url"],
        message: "Choisissez une page ou une URL.",
      });
    }
  });

export const modifierMenuItemSchema = creerMenuItemSchema;

export type CreerMenuItemData = z.infer<typeof creerMenuItemSchema>;
export type ModifierMenuItemData = z.infer<typeof modifierMenuItemSchema>;
