import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

import { searchSites } from "@/lib/freeserp"
import { formatNumber } from "@/lib/format"
import { OG_COLORS, OG_SIZE, OgCard } from "@/lib/og"
import { getVerdict, VERDICTS } from "@/lib/verdict"

// Share image for a scouted idea: the verdict, the competitor count and the meter.
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim().slice(0, 80) ?? ""
  let total: number | null = null
  if (q) {
    try {
      total = (await searchSites({ q, size: 1 })).total
    } catch {
      total = null
    }
  }
  const verdict = total != null ? getVerdict(total) : null
  const levels = [...VERDICTS].reverse()

  return new ImageResponse(
    <OgCard
      eyebrow={q ? `“${q}”` : "Scout an AI idea"}
      title={verdict ? verdict.label : "Is your AI idea already taken?"}
    >
      {verdict && total != null && (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 34, color: OG_COLORS.INK }}>
            {`${formatNumber(total)} AI ${total === 1 ? "startup matches" : "startups match"} this idea`}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {levels.map((level, i) => (
              <div
                key={level.label}
                style={{ display: "flex", flexDirection: "column", gap: 10, width: 200 }}
              >
                <div
                  style={{
                    height: 14,
                    borderRadius: 7,
                    background: i < verdict.level ? OG_COLORS.ACCENT : "#2a3830",
                    opacity: i < verdict.level ? 0.45 + i * 0.18 : 1,
                  }}
                />
                <div
                  style={{
                    fontSize: 22,
                    color: i + 1 === verdict.level ? OG_COLORS.INK : OG_COLORS.MUTED,
                  }}
                >
                  {level.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </OgCard>,
    {
      ...OG_SIZE,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  )
}
