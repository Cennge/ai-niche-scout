import { describe, expect, it } from "vitest"

import { monthRange } from "@/lib/filter-options"
import { maxPage, parseFilters, toSearchParams } from "@/lib/filters"
import { MAX_OFFSET, PAGE_SIZE } from "@/lib/freeserp"

describe("parseFilters", () => {
  it("reads the first value of repeated params and trims", () => {
    expect(parseFilters({ q: ["  voice agent ", "other"] }).q).toBe("voice agent")
  })

  it("treats blank queries as no query", () => {
    expect(parseFilters({ q: "   " }).q).toBeUndefined()
  })

  it("caps very long queries at 200 characters", () => {
    expect(parseFilters({ q: "a".repeat(500) }).q).toHaveLength(200)
  })

  it.each(["0", "-5", "1.5", "abc", undefined])("falls back to page 1 for %s", (page) => {
    expect(parseFilters({ page }).page).toBe(1)
  })

  it("keeps valid page numbers", () => {
    expect(parseFilters({ page: "7" }).page).toBe(7)
  })
})

describe("toSearchParams", () => {
  it("maps known filters to API parameters", () => {
    const params = toSearchParams(
      parseFilters({ niche: "legal", dr: "40", tld: "ai", builder: "lovable", sort: "dr", page: "3" }),
    )
    expect(params).toMatchObject({
      niche: "Legal",
      drMin: 40,
      tld: "ai",
      builder: "lovable",
      sort: "dr",
      order: "desc",
      from: 2 * PAGE_SIZE,
      size: PAGE_SIZE,
    })
  })

  it("drops values that are not on the allow-lists", () => {
    const params = toSearchParams(
      parseFilters({ niche: "bogus", dr: "13", tld: "xyz", builder: "hack", sort: "nope", indexed: "2026-13" }),
    )
    expect(params.niche).toBeUndefined()
    expect(params.drMin).toBeUndefined()
    expect(params.tld).toBeUndefined()
    expect(params.builder).toBeUndefined()
    expect(params.sort).toBeUndefined()
    expect(params.fromDate).toBeUndefined()
  })

  it("maps 'oldest' to an ascending went_live sort", () => {
    expect(toSearchParams(parseFilters({ sort: "oldest" }))).toMatchObject({
      sort: "went_live",
      order: "asc",
    })
  })

  it("turns an indexed month into a full date range", () => {
    expect(toSearchParams(parseFilters({ indexed: "2026-09" }))).toMatchObject({
      fromDate: "2026-09-01",
      toDate: "2026-09-30",
    })
  })

  it("lets a niche page fix the niche regardless of the URL", () => {
    expect(toSearchParams(parseFilters({ niche: "legal" }), "Voice Cloning").niche).toBe("Voice Cloning")
  })

  it("never pages past the API's offset limit", () => {
    const params = toSearchParams(parseFilters({ page: "99999" }))
    expect(params.from! + PAGE_SIZE).toBeLessThanOrEqual(MAX_OFFSET)
  })
})

describe("monthRange", () => {
  it("handles month lengths and leap years", () => {
    expect(monthRange("2026-02")).toEqual({ fromDate: "2026-02-01", toDate: "2026-02-28" })
    expect(monthRange("2028-02")).toEqual({ fromDate: "2028-02-01", toDate: "2028-02-29" })
    expect(monthRange("2026-12")).toEqual({ fromDate: "2026-12-01", toDate: "2026-12-31" })
  })
})

describe("maxPage", () => {
  it("rounds up and respects the offset limit", () => {
    expect(maxPage(0)).toBe(1)
    expect(maxPage(21)).toBe(2)
    expect(maxPage(1_000_000)).toBe(MAX_OFFSET / PAGE_SIZE)
  })
})
