import { describe, expect, it } from "vitest"

import { getVerdict } from "@/lib/verdict"

describe("getVerdict", () => {
  it.each([
    [0, "Open field", 1],
    [19, "Open field", 1],
    [20, "Emerging", 2],
    [199, "Emerging", 2],
    [200, "Competitive", 3],
    [999, "Competitive", 3],
    [1000, "Crowded", 4],
    [33570, "Crowded", 4],
  ])("maps %i competitors to %s", (count, label, level) => {
    const verdict = getVerdict(count)
    expect(verdict.label).toBe(label)
    expect(verdict.level).toBe(level)
  })
})
