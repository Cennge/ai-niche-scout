import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { RawSearchParams } from "@/lib/filters"

function pageHref(pathname: string, raw: RawSearchParams, page: number) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(raw)) {
    if (key !== "page" && typeof value === "string") params.set(key, value)
  }
  if (page > 1) params.set("page", String(page))
  const query = params.toString()
  return query ? `${pathname}?${query}` : pathname
}

function visiblePages(current: number, last: number) {
  const pages = new Set([1, last, current - 1, current, current + 1])
  return [...pages].filter((p) => p >= 1 && p <= last).sort((a, b) => a - b)
}

export function ResultsPagination({
  pathname,
  searchParams,
  page,
  lastPage,
}: {
  pathname: string
  searchParams: RawSearchParams
  page: number
  lastPage: number
}) {
  if (lastPage <= 1) return null
  const pages = visiblePages(page, lastPage)

  return (
    <Pagination>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious href={pageHref(pathname, searchParams, page - 1)} />
          </PaginationItem>
        )}
        {pages.map((p, i) => (
          <PaginationItem key={p}>
            {i > 0 && p - pages[i - 1] > 1 && <PaginationEllipsis />}
            <PaginationLink href={pageHref(pathname, searchParams, p)} isActive={p === page}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        {page < lastPage && (
          <PaginationItem>
            <PaginationNext href={pageHref(pathname, searchParams, page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
