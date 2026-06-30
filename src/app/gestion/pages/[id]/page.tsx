import Link from "next/link";
import { notFound } from "next/navigation";

import { Pencil } from "lucide-react";

import { exigerPermission } from "@/lib/autorisations";
import { formaterDate } from "@/lib/dates";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import { recupererPageParId } from "@/services/page.service";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/ui/page/page-section";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PagePage({ params }: Props) {
  await exigerPermission(Permissions.PAGES_GERER.code);

  const { id } = await params;

  const page = await recupererPageParId(id);

  if (!page) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{page.titre}</h1>

            {page.publiee ? (
              <Badge>Publiée</Badge>
            ) : (
              <Badge variant="secondary">Brouillon</Badge>
            )}
          </div>

          <p className="text-muted-foreground">/{page.slug}</p>
        </div>

        <Button asChild>
          <Link href={Routes.modifierPage(page.id)}>
            <Pencil className="h-4 w-4" />
            Modifier
          </Link>
        </Button>
      </div>

      <PageSection title="Informations" bordered={false}>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Titre</p>

            <p>{page.titre}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Chemin</p>

            <p>/{page.slug}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Statut</p>

            <p>{page.publiee ? "Publiée" : "Brouillon"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Créée le</p>

            <p>{formaterDate(page.createdAt)}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Modifiée le</p>

            <p>{formaterDate(page.updatedAt)}</p>
          </div>
        </div>
      </PageSection>

      <PageSection title="Référencement (SEO)" bordered={false}>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Titre SEO</p>

            <p>{page.seoTitre || "-"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Description SEO</p>

            <p>{page.seoDescription || "-"}</p>
          </div>
        </div>
      </PageSection>

      <PageSection title="Contenu" bordered={false}>
        {page.contenu ? (
          <pre className="overflow-auto rounded-lg border bg-muted p-4 text-xs">
            {JSON.stringify(page.contenu, null, 2)}
          </pre>
        ) : (
          <p className="text-muted-foreground">
            {"Aucun contenu n'a encore été défini."}
          </p>
        )}
      </PageSection>
    </div>
  );
}
