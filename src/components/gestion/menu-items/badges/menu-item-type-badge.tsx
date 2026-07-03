import { Badge } from "@/components/ui/badge";

export function TypeMenuItemBadge({
  pageId,
  url,
}: {
  pageId: string | null;
  url: string | null;
}) {
  if (pageId) {
    return <Badge className="bg-emerald-500 hover:bg-emerald-500">Page</Badge>;
  }

  if (url) {
    return <Badge className="bg-orange-500 hover:bg-orange-500">URL</Badge>;
  }
}
