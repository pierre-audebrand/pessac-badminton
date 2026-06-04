import { Card, CardContent } from "@/components/ui/card";

interface DataTableEmptyStateProps {
  title: string;
  description?: string;
}

export function DataTableEmptyState({
  title,
  description,
}: DataTableEmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="font-semibold">{title}</h3>

        {description && (
          <p className="text-muted-foreground mt-2 text-sm">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
