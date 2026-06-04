"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { usePathname, useSearchParams } from "next/navigation";

interface DataTablePaginationProps {
  page: number;
  pageCount: number;
}

export function DataTablePagination({
  page,
  pageCount,
}: DataTablePaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createHref = (newPage: number) => {
    const query = new URLSearchParams(searchParams.toString());

    query.set("page", String(newPage));

    return `${pathname}?${query.toString()}`;
  };

  const pages: (number | "ellipsis")[] = [];

  if (pageCount <= 7) {
    for (let i = 1; i <= pageCount; i++) {
      pages.push(i);
    }
  } else if (page <= 4) {
    pages.push(1, 2, 3, 4, 5, "ellipsis", pageCount);
  } else if (page >= pageCount - 3) {
    pages.push(
      1,
      "ellipsis",
      pageCount - 4,
      pageCount - 3,
      pageCount - 2,
      pageCount - 1,
      pageCount,
    );
  } else {
    pages.push(1, "ellipsis", page - 1, page, page + 1, "ellipsis", pageCount);
  }

  if (pageCount <= 1) {
    return null;
  }

  const isFirstPage = page === 1;
  const isLastPage = page === pageCount;

  const previousPage = Math.max(1, page - 1);
  const nextPage = Math.min(pageCount, page + 1);

  return (
    <div className="space-y-2">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={createHref(previousPage)}
              text="Préc."
              aria-label="Page précédente"
              className={
                isFirstPage ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>

          {pages.map((item, index) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  href={createHref(item)}
                  isActive={item === page}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              href={createHref(nextPage)}
              text="Suiv."
              aria-label="Page suivante"
              className={
                isLastPage ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <p className="text-center text-sm text-muted-foreground">
        Page {page} sur {pageCount}
      </p>
    </div>
  );
}
