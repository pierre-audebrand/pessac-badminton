import Link from "next/link";
import { notFound } from "next/navigation";

import { Pencil } from "lucide-react";

import { exigerPermission } from "@/lib/autorisations";
import { formaterDate } from "@/lib/dates";
import { Permissions } from "@/lib/permissions";
import { Routes } from "@/lib/routes";

import { recupererMenuItemParId } from "@/services/menu-item.service";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageSection } from "@/components/ui/page/page-section";

import { MenuBadge } from "@/components/gestion/menu-items/badges/menu-badge";
import { TypeMenuItemBadge } from "@/components/gestion/menu-items/badges/menu-item-type-badge";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MenuItemPage({ params }: Props) {
  await exigerPermission(Permissions.MENUS_GERER.code);

  const { id } = await params;

  const menuItem = await recupererMenuItemParId(id);

  if (!menuItem) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{menuItem.libelle}</h1>

            {menuItem.actif ? (
              <Badge>Actif</Badge>
            ) : (
              <Badge variant="secondary">Inactif</Badge>
            )}
          </div>

          <p className="text-muted-foreground">Élément de navigation</p>
        </div>

        <Button asChild>
          <Link href={Routes.modifierMenuItem(menuItem.id)}>
            <Pencil className="h-4 w-4" />
            Modifier
          </Link>
        </Button>
      </div>

      <PageSection title="Informations" bordered={false}>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Libellé</p>
            <p>{menuItem.libelle}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Menu</p>
            <MenuBadge menu={menuItem.menu} />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <TypeMenuItemBadge pageId={menuItem.pageId} url={menuItem.url} />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Ordre</p>
            <p>{menuItem.ordre}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Statut</p>
            <p>{menuItem.actif ? "Actif" : "Inactif"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Créé le</p>
            <p>{formaterDate(menuItem.createdAt)}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Modifié le</p>
            <p>{formaterDate(menuItem.updatedAt)}</p>
          </div>
        </div>
      </PageSection>

      <PageSection title="Navigation" bordered={false}>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Parent</p>

            <p>{menuItem.parent?.libelle ?? "-"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Page liée</p>

            <p>{menuItem.page?.titre ?? "-"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">URL</p>

            <p>{menuItem.url ?? "-"}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Nouvel onglet</p>

            <p>{menuItem.nouvelOnglet ? "Oui" : "Non"}</p>
          </div>
        </div>
      </PageSection>

      <PageSection title="Sous-éléments" bordered={false}>
        {menuItem.enfants.length === 0 ? (
          <p className="text-muted-foreground">Aucun sous-élément.</p>
        ) : (
          <ul className="space-y-2">
            {menuItem.enfants.map((enfant) => (
              <li
                key={enfant.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <span>{enfant.libelle}</span>

                <TypeMenuItemBadge pageId={enfant.pageId} url={enfant.url} />
              </li>
            ))}
          </ul>
        )}
      </PageSection>
    </div>
  );
}
