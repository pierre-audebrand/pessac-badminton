"use client";

import { useActionState, useRef } from "react";

import type { PageFormState } from "@/actions/page.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/cms";
import { RefreshCw } from "lucide-react";

type Props = {
  action: (state: PageFormState, formData: FormData) => Promise<PageFormState>;

  page?: {
    titre: string;
    slug: string;
    seoTitre: string | null;
    seoDescription: string | null;
    publiee: boolean;
  };

  texteBouton: string;
};

const initialState: PageFormState = {};

export function FormulairePage({ action, page, texteBouton }: Props) {
  const [state, formAction] = useActionState(action, initialState);

  const titreRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);

  return (
    <form action={formAction} className="max-w-2xl space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="titre" required>
          Titre
        </Label>

        <Input
          ref={titreRef}
          id="titre"
          name="titre"
          required
          defaultValue={page?.titre}
        />

        {state.erreurs?.titre?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug" required>
          Chemin
        </Label>

        <div className="flex gap-2">
          <Input
            ref={slugRef}
            id="slug"
            name="slug"
            required
            defaultValue={page?.slug}
          />

          <Button
            type="button"
            variant="outline"
            size="icon"
            title="Régénérer le slug"
            onClick={() => {
              if (titreRef.current && slugRef.current) {
                slugRef.current.value = slugify(titreRef.current.value);
              }
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seoTitre">Titre SEO</Label>

        <Input
          id="seoTitre"
          name="seoTitre"
          maxLength={60}
          defaultValue={page?.seoTitre ?? ""}
        />

        <p className="text-xs text-muted-foreground">
          Recommandé : 50 à 60 caractères.
        </p>

        {state.erreurs?.seoTitre?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="seoDescription">Description SEO</Label>

        <Textarea
          id="seoDescription"
          name="seoDescription"
          rows={4}
          maxLength={160}
          defaultValue={page?.seoDescription ?? ""}
        />

        <p className="text-xs text-muted-foreground">
          Recommandé : 150 à 160 caractères.
        </p>

        {state.erreurs?.seoDescription?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <input
          id="publiee"
          name="publiee"
          type="checkbox"
          defaultChecked={page?.publiee}
          className="h-4 w-4"
        />
        <Label htmlFor="publiee">Page publiée</Label>
      </div>

      {state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit">{texteBouton}</Button>
    </form>
  );
}
