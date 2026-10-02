import { describe, expect, it } from "vitest"

import { builderLabel, clampText, formatDate, formatNumber, pluralize } from "@/lib/format"
import { compareHref } from "@/lib/compare"
import { getNicheByName, getNicheBySlug, NICHES } from "@/lib/niches"

describe("format", () => {
  it("formats numbers with thousands separators", () => {
    expect(formatNumber(33570)).toBe("33,570")
  })

  it("formats ISO dates in UTC, independent of the server time zone", () => {
    expect(formatDate("2026-09-08")).toBe("Sep 8, 2026")
    expect(formatDate(null)).toBe("Unknown")
    expect(formatDate("not-a-date")).toBe("not-a-date")
  })

  it("pluralizes", () => {
    expect(pluralize(1, "startup")).toBe("1 startup")
    expect(pluralize(2, "startup")).toBe("2 startups")
  })

  it("hides builder values that mean nothing to people", () => {
    expect(builderLabel("lovable")).toBe("Lovable")
    expect(builderLabel("not_ai")).toBeNull()
    expect(builderLabel(null)).toBeNull()
  })

  it("builds encoded compare links", () => {
    expect(compareHref([])).toBe("/compare")
    expect(compareHref(["a.com", "b.io"])).toBe("/compare?d=a.com,b.io")
  })
})

describe("niches", () => {
  it("has 54 niches with unique slugs and names", () => {
    expect(NICHES).toHaveLength(54)
    expect(new Set(NICHES.map((n) => n.slug)).size).toBe(54)
    expect(new Set(NICHES.map((n) => n.name)).size).toBe(54)
  })

  it("uses URL-safe slugs", () => {
    for (const n of NICHES) expect(n.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it("looks niches up both ways", () => {
    expect(getNicheBySlug("legal")?.name).toBe("Legal")
    expect(getNicheByName("Legal")?.slug).toBe("legal")
    expect(getNicheBySlug("nope")).toBeUndefined()
  })
})

describe("clampText", () => {
  it("keeps short text as is and collapses whitespace", () => {
    expect(clampText("  Short   title ", 40)).toBe("Short title")
  })

  it("cuts long text at a word boundary within the limit", () => {
    const out = clampText("Goodcall is a Voice AI platform that provides agentic voice AI solutions", 40)
    expect(out.length).toBeLessThanOrEqual(40)
    expect(out.endsWith("…")).toBe(true)
    expect(out).toBe("Goodcall is a Voice AI platform that…")
  })

  it("drops trailing separators before the ellipsis", () => {
    expect(clampText("Legal tools, contracts, compliance and more", 24)).toBe("Legal tools, contracts…")
  })
})
