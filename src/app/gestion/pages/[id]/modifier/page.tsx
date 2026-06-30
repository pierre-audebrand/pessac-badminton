import { notFound } from "next/navigation";

import { exigerPermission } from "@/lib/autorisations";
import { Permissions } from "@/lib/permissions";

import { modifierPageAction } from "@/actions/page.actions";

import { recupererPageParId } from "@/services/page.service";

import { FormulairePage } from "@/components/gestion/pages/formulaire-page";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ModifierPagePage({ params }: Props) {
  await exigerPermission(Permissions.PAGES_GERER.code);

  const { id } = await params;

  const page = await recupererPageParId(id);

  if (!page) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Modifier la page</h1>

        <p className="text-muted-foreground">
          Modifier les informations de la page.
        </p>
      </div>

      <FormulairePage
        action={modifierPageAction.bind(null, page.id)}
        texteBouton="Enregistrer"
        page={{
          titre: page.titre,
          slug: page.slug,
          seoTitre: page.seoTitre,
          seoDescription: page.seoDescription,
          publiee: page.publiee,
        }}
      />
    </div>
  );
}
