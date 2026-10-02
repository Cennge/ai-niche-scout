import Link from "next/link"

import { RevealOnView } from "@/components/reveal-on-view"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import type { NicheStat } from "@/lib/freeserp"
import { formatNumber } from "@/lib/format"
import { squarify } from "@/lib/treemap"
import { cn } from "@/lib/utils"

// Five density bands, from a handful of startups to thousands.
export const DENSITY_BANDS = [
  { max: 100, label: "Under 100", tile: "bg-chart-1 text-chart-1-foreground" },
  { max: 300, label: "100–299", tile: "bg-chart-2 text-chart-2-foreground" },
  { max: 1000, label: "300–999", tile: "bg-chart-3 text-chart-3-foreground" },
  { max: 3000, label: "1,000–2,999", tile: "bg-chart-4 text-chart-4-foreground" },
  { max: Infinity, label: "3,000+", tile: "bg-chart-5 text-chart-5-foreground" },
]

export function densityBand(total: number) {
  return DENSITY_BANDS.find((band) => total < band.max) ?? DENSITY_BANDS[DENSITY_BANDS.length - 1]
}

function NichePreview({ niche, totalStartups }: { niche: NicheStat; totalStartups: number }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <p className="font-semibold">{niche.name}</p>
        <p className="text-sm text-muted-foreground">{niche.blurb}</p>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Startups</dt>
          <dd className="font-medium">{formatNumber(niche.total)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Share of all</dt>
          <dd className="font-medium">{((niche.total / totalStartups) * 100).toFixed(1)}%</dd>
        </div>
      </dl>
      {niche.leaders.length > 0 && (
        <div className="flex flex-col gap-1.5 border-t pt-3 text-sm">
          <p className="text-muted-foreground">Leaders by Domain Rating</p>
          <ul className="flex flex-col gap-1">
            {niche.leaders.map((leader) => (
              <li key={leader.domain} className="flex items-center justify-between gap-3">
                <span translate="no" className="truncate">
                  {leader.domain}
                </span>
                <span className="shrink-0 text-muted-foreground tabular-nums">
                  {leader.dr != null ? `DR ${leader.dr}` : "No DR"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function TreemapLayout({
  stats,
  totalStartups,
  width,
  height,
  previews = false,
  className,
}: {
  stats: NicheStat[]
  totalStartups: number
  width: number
  height: number
  // Hover previews only make sense with a pointer, so the mobile layout skips them.
  previews?: boolean
  className?: string
}) {
  const tiles = squarify(stats, (s) => s.total, width, height)

  return (
    <ul
      className={cn("relative w-full overflow-hidden rounded-xl border", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {tiles.map(({ x, y, w, h, item }, i) => (
        <li
          key={item.slug}
          className="treemap-tile absolute p-px"
          style={
            {
              "--i": i,
              left: `${(x / width) * 100}%`,
              top: `${(y / height) * 100}%`,
              width: `${(w / width) * 100}%`,
              height: `${(h / height) * 100}%`,
            } as React.CSSProperties
          }
        >
          <TileLink item={item} totalStartups={totalStartups} previews={previews} />
        </li>
      ))}
    </ul>
  )
}

function TileLink({
  item,
  totalStartups,
  previews,
}: {
  item: NicheStat
  totalStartups: number
  previews: boolean
}) {
  const link = (
    <Link
      href={`/niche/${item.slug}`}
      className={cn(
        "@container flex size-full flex-col justify-between overflow-hidden rounded-[3px] p-1.5 outline-none transition-[filter] hover:brightness-110 focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring",
        densityBand(item.total).tile,
      )}
    >
      <span className="hidden text-xs leading-tight font-medium @min-[4.5rem]:line-clamp-3 @min-[9rem]:text-sm">
        {item.name}
      </span>
      <span className="hidden text-xs opacity-80 @min-[4.5rem]:block">
        {formatNumber(item.total)}
      </span>
      <span className="sr-only">
        {item.name}, {formatNumber(item.total)} startups
      </span>
    </Link>
  )
  if (!previews) return link

  return (
    <HoverCard openDelay={120} closeDelay={60}>
      <HoverCardTrigger asChild>{link}</HoverCardTrigger>
      <HoverCardContent className="w-72" side="top">
        <NichePreview niche={item} totalStartups={totalStartups} />
      </HoverCardContent>
    </HoverCard>
  )
}

export function MarketMap({ stats, totalStartups }: { stats: NicheStat[]; totalStartups: number }) {
  return (
    <RevealOnView>
      <figure className="flex flex-col gap-3">
        <TreemapLayout
          stats={stats}
          totalStartups={totalStartups}
          width={1200}
          height={620}
          previews
          className="hidden sm:block"
        />
        <TreemapLayout
          stats={stats}
          totalStartups={totalStartups}
          width={360}
          height={560}
          className="sm:hidden"
        />
        <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span>Startups per niche</span>
          <ul className="flex flex-wrap gap-x-3 gap-y-1">
            {DENSITY_BANDS.map((band) => (
              <li key={band.label} className="flex items-center gap-1.5">
                <span className={cn("size-3 rounded-sm border", band.tile)} aria-hidden="true" />
                {band.label}
              </li>
            ))}
          </ul>
        </figcaption>
      </figure>
    </RevealOnView>
  )
}
