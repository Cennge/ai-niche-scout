// Filter options shared by server pages and client filter controls.

export type SortValue = "relevance" | "went_live" | "oldest" | "dr"

export const TLDS = ["com", "ai", "io", "dev", "co", "app", "tech", "net", "org"]
export const DR_OPTIONS = [
  { value: "1", label: "Has a rating" },
  { value: "20", label: "20+" },
  { value: "40", label: "40+" },
  { value: "60", label: "60+" },
]
export const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "relevance", label: "Best match" },
  { value: "went_live", label: "Newest indexed" },
  { value: "oldest", label: "Oldest indexed" },
  { value: "dr", label: "Highest DR" },
]

// The index only covers recent months: candidates are the last six months, and the server
// keeps the ones that actually contain startups (see getIndexedMonths).
export function recentMonths(now = new Date(), count = 6) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1))
    return {
      value: d.toISOString().slice(0, 7),
      label: d.toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" }),
    }
  })
}

export function monthRange(value: string) {
  const [year, month] = value.split("-").map(Number)
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return { fromDate: `${value}-01`, toDate: `${value}-${String(last).padStart(2, "0")}` }
}
