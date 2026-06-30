import { Badge } from "@/components/ui/badge";
import { Menu } from "@prisma/client";

export function MenuBadge({ menu }: { menu: Menu }) {
  switch (menu) {
    case Menu.PRINCIPAL:
      return <Badge>Principal</Badge>;

    case Menu.FOOTER:
      return <Badge variant="secondary">Footer</Badge>;
  }
}
