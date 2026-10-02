import { describe, expect, it } from "vitest"

import { squarify } from "@/lib/treemap"

const EPS = 1e-6

function overlaps(a: { x: number; y: number; w: number; h: number }, b: typeof a) {
  return a.x < b.x + b.w - EPS && b.x < a.x + a.w - EPS && a.y < b.y + b.h - EPS && b.y < a.y + a.h - EPS
}

describe("squarify", () => {
  // Real niche sizes from the index, including the extremes.
  const values = [10510, 9352, 8283, 4897, 3099, 1906, 1517, 984, 566, 185, 86, 36, 22]
  const W = 1200
  const H = 620
  const tiles = squarify(values, (v) => v, W, H)
  const total = values.reduce((a, b) => a + b, 0)

  it("lays out every item exactly once", () => {
    expect(tiles).toHaveLength(values.length)
    expect(tiles.map((t) => t.item).sort((a, b) => b - a)).toEqual(values)
  })

  it("makes each tile's area proportional to its value", () => {
    for (const t of tiles) {
      expect(t.w * t.h).toBeCloseTo((t.item / total) * W * H, 3)
    }
  })

  it("keeps tiles inside the canvas", () => {
    for (const t of tiles) {
      expect(t.x).toBeGreaterThanOrEqual(-EPS)
      expect(t.y).toBeGreaterThanOrEqual(-EPS)
      expect(t.x + t.w).toBeLessThanOrEqual(W + EPS)
      expect(t.y + t.h).toBeLessThanOrEqual(H + EPS)
    }
  })

  it("never overlaps two tiles", () => {
    for (let i = 0; i < tiles.length; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        expect(overlaps(tiles[i], tiles[j])).toBe(false)
      }
    }
  })

  it("orders tiles largest first", () => {
    const order = tiles.map((t) => t.item)
    expect(order).toEqual([...order].sort((a, b) => b - a))
  })
})
