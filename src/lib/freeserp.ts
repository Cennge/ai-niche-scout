import "server-only"

import { cache } from "react"

import { monthRange, recentMonths } from "@/lib/filter-options"
import { formatNumber } from "@/lib/format"
import { NICHES, type Niche } from "@/lib/niches"

// Typed client for the FreeSerp sites index (https://freeserp.ai/docs.php).
// Every request is scoped to genuine AI products (`ai_startups=1`) and cached by Next.js.

const ENDPOINT = "https://freeserp.ai/api.php"
const PROJECT = "ai-niche-scout"

export const PAGE_SIZE = 20
// The sites index pages up to an offset of 10,000.
export const MAX_OFFSET = 10_000

export type Site = {
  domain: string
  url: string
  title: string | null
  ai_summary: string | null
  ai_categories: string[] | null
  dr: number | null
  went_live: string | null
  first_seen: string | null
  tld: string | null
  ai_source: string | null
  webserver: string | null
}

export type SearchResult = {
  total: number
  results: Site[]
}

export type SortKey = "relevance" | "went_live" | "dr"

export type SearchParams = {
  q?: string
  niche?: string // ai_categories value (display name)
  drMin?: number
  drMax?: number
  fromDate?: string
  toDate?: string
  tld?: string
  builder?: string // ai_source value
  sort?: SortKey
  order?: "asc" | "desc"
  size?: number
  from?: number
}

export class FreeSerpError extends Error {}

async function request(
  params: Record<string, string | number | undefined>,
  revalidate: number,
): Promise<SearchResult> {
  const url = new URL(ENDPOINT)
  url.searchParams.set("project", PROJECT)
  url.searchParams.set("ai_startups", "1")
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value))
  }

  let res: Response
  try {
    res = await fetch(url, { next: { revalidate } })
  } catch {
    throw new FreeSerpError("FreeSerp is unreachable. Check your connection and try again.")
  }
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok) {
    throw new FreeSerpError(data?.error ?? `FreeSerp responded with HTTP ${res.status}.`)
  }
  return { total: data.total ?? 0, results: data.results ?? [] }
}

export function searchSites(params: SearchParams, revalidate = 3600) {
  return request(
    {
      q: params.q?.trim(),
      ai_categories: params.niche,
      dr_min: params.drMin,
      dr_max: params.drMax,
      from_date: params.fromDate,
      to_date: params.toDate,
      tld: params.tld,
      ai_source: params.builder,
      sort: params.sort && params.sort !== "relevance" ? params.sort : undefined,
      order: params.sort && params.sort !== "relevance" ? (params.order ?? "desc") : undefined,
      size: params.size ?? PAGE_SIZE,
      from: params.from,
    },
    revalidate,
  )
}

/** Looks up one startup. The API has no domain filter, but exact domain queries rank first. */
export const getSite = cache(async (domain: string): Promise<Site | null> => {
  const { results } = await request({ q: domain, size: 5 }, 86400)
  return results.find((site) => site.domain === domain) ?? null
})

export type NicheStat = Niche & { total: number }

/** Startup count for every niche, largest first. One request per niche, cached for a day. */
export const getNicheStats = cache(async (): Promise<NicheStat[]> => {
  const stats = await Promise.all(
    NICHES.map(async (niche) => {
      const { total } = await request({ ai_categories: niche.name, size: 1 }, 86400)
      return { ...niche, total }
    }),
  )
  return stats.sort((a, b) => b.total - a.total)
})

export const getTotalStartups = cache(async () => {
  const { total } = await request({ size: 1 }, 86400)
  return total
})

/** Months that contain indexed startups, newest first, labelled with their counts. */
export const getIndexedMonths = cache(async () => {
  const months = await Promise.all(
    recentMonths().map(async (month) => {
      const { fromDate, toDate } = monthRange(month.value)
      const { total } = await request({ from_date: fromDate, to_date: toDate, size: 1 }, 86400)
      return { value: month.value, label: `${month.label} (${formatNumber(total)})`, total }
    }),
  )
  return months.filter((m) => m.total > 0).map(({ value, label }) => ({ value, label }))
})
