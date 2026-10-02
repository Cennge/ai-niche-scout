import { DR_OPTIONS, monthRange, TLDS } from "@/lib/filter-options"
import { MAX_OFFSET, PAGE_SIZE, type SearchParams } from "@/lib/freeserp"
import { BUILDERS } from "@/lib/format"
import { getNicheBySlug } from "@/lib/niches"

// Filters live in the URL so every view is shareable and server-rendered.
// Shape: ?q=&niche=<slug>&dr=<min>&indexed=<YYYY-MM>&tld=&builder=&sort=&page=

export type RawSearchParams = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined
}

export type Filters = {
  q?: string
  niche?: string
  dr?: string
  indexed?: string
  tld?: string
  builder?: string
  sort?: string
  page: number
}

export function parseFilters(raw: RawSearchParams): Filters {
  const page = Number(first(raw.page))
  return {
    q: first(raw.q)?.slice(0, 200),
    niche: first(raw.niche),
    dr: first(raw.dr),
    indexed: first(raw.indexed),
    tld: first(raw.tld),
    builder: first(raw.builder),
    sort: first(raw.sort),
    page: Number.isInteger(page) && page > 1 ? page : 1,
  }
}

export function toSearchParams(filters: Filters, fixedNiche?: string): SearchParams {
  const params: SearchParams = { q: filters.q, size: PAGE_SIZE }

  const nicheName = fixedNiche ?? (filters.niche && getNicheBySlug(filters.niche)?.name)
  if (nicheName) params.niche = nicheName

  if (filters.dr && DR_OPTIONS.some((o) => o.value === filters.dr)) params.drMin = Number(filters.dr)

  if (filters.indexed && /^\d{4}-(0[1-9]|1[0-2])$/.test(filters.indexed)) {
    Object.assign(params, monthRange(filters.indexed))
  }

  if (filters.tld && TLDS.includes(filters.tld)) params.tld = filters.tld
  if (filters.builder && filters.builder in BUILDERS) params.builder = filters.builder

  if (filters.sort === "oldest") {
    params.sort = "went_live"
    params.order = "asc"
  } else if (filters.sort === "went_live" || filters.sort === "dr") {
    params.sort = filters.sort
    params.order = "desc"
  }

  params.from = Math.min((filters.page - 1) * PAGE_SIZE, MAX_OFFSET - PAGE_SIZE)
  return params
}

export function maxPage(total: number) {
  return Math.max(1, Math.ceil(Math.min(total, MAX_OFFSET) / PAGE_SIZE))
}
