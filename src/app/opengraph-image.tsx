import { ImageResponse } from "next/og"

import { OG_COLORS, OG_SIZE, OgCard } from "@/lib/og"

export const alt = "AI Niche Scout: is your AI idea already taken?"
export const size = OG_SIZE
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    <OgCard eyebrow="33,000+ AI startups across 54 niches" title="Is your AI idea already taken?">
      <div style={{ fontSize: 32, color: OG_COLORS.MUTED }}>
        See who already builds it and how crowded the niche is.
      </div>
    </OgCard>,
    size,
  )
}
