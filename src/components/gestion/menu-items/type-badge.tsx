import { Badge } from "@/components/ui/badge";
import { TypeMenuItem } from "@prisma/client";

export function TypeMenuItemBadge({ type }: { type: TypeMenuItem }) {
  switch (type) {
    case TypeMenuItem.PAGE:
      return (
        <Badge className="bg-emerald-500 hover:bg-emerald-500">Page</Badge>
      );

    case TypeMenuItem.URL:
      return <Badge className="bg-orange-500 hover:bg-orange-500">URL</Badge>;

    case TypeMenuItem.GROUPE:
      return <Badge variant="outline">Groupe</Badge>;
  }
}
