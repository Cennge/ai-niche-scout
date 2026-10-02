import { ImageResponse } from "next/og"

import { getNicheStats } from "@/lib/freeserp"
import { formatNumber } from "@/lib/format"
import { getNicheBySlug, NICHES } from "@/lib/niches"
import { OG_COLORS, OG_SIZE, OgCard } from "@/lib/og"

export const alt = "AI niche overview on AI Niche Scout"
export const size = OG_SIZE
export const contentType = "image/png"

export function generateStaticParams() {
  return NICHES.map((niche) => ({ slug: niche.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const niche = getNicheBySlug(slug)
  const stats = await getNicheStats()
  const index = stats.findIndex((s) => s.slug === slug)
  const stat = stats[index]

  return new ImageResponse(
    <OgCard
      eyebrow={
        stat
          ? `${formatNumber(stat.total)} AI startups, rank ${index + 1} of ${stats.length}`
          : "AI niche"
      }
      title={niche?.name ?? "AI niche"}
    >
      <div style={{ display: "flex", fontSize: 32, color: OG_COLORS.MUTED }}>
        {niche?.blurb ?? ""}
      </div>
    </OgCard>,
    size,
  )
}
