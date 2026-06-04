import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { PageRecherche } from "@/services/page.service";

import { PageActions } from "./actions";

interface Props {
  page: PageRecherche;
}

export function PageCard({ page }: Props) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{page.titre}</h3>

            {page.publiee ? (
              <Badge>Publiée</Badge>
            ) : (
              <Badge variant="secondary">Brouillon</Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">/{page.chemin}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Titre SEO</p>

          <p>{page.seoTitre ?? "-"}</p>
        </div>

        <PageActions page={page} />
      </CardContent>
    </Card>
  );
}
