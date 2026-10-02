import Link from "next/link"

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

function TreemapLayout({
  stats,
  width,
  height,
  className,
}: {
  stats: NicheStat[]
  width: number
  height: number
  className?: string
}) {
  const tiles = squarify(stats, (s) => s.total, width, height)

  return (
    <ul
      className={cn("relative w-full overflow-hidden rounded-xl border", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {tiles.map(({ x, y, w, h, item }) => (
        <li
          key={item.slug}
          className="absolute p-px"
          style={{
            left: `${(x / width) * 100}%`,
            top: `${(y / height) * 100}%`,
            width: `${(w / width) * 100}%`,
            height: `${(h / height) * 100}%`,
          }}
        >
          <Link
            href={`/niche/${item.slug}`}
            title={`${item.name}: ${formatNumber(item.total)} startups`}
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
        </li>
      ))}
    </ul>
  )
}

export function MarketMap({ stats }: { stats: NicheStat[] }) {
  return (
    <figure className="flex flex-col gap-3">
      <TreemapLayout stats={stats} width={1200} height={620} className="hidden sm:block" />
      <TreemapLayout stats={stats} width={360} height={560} className="sm:hidden" />
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
  )
}
