import type { Metadata } from "next"
import Link from "next/link"

import { densityBand, MarketMap } from "@/components/market-map"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getNicheStats, getTotalStartups } from "@/lib/freeserp"
import { formatNumber } from "@/lib/format"
import { cn } from "@/lib/utils"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "All 54 AI niches, ranked by number of startups",
  description:
    "A map of the AI startup market: 54 niches from AI agents to voice cloning, with the number of startups in each.",
  alternates: { canonical: "/niches" },
}

export default async function NichesPage() {
  const [stats, total] = await Promise.all([getNicheStats(), getTotalStartups()])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6">
      <div className="flex max-w-3xl flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">AI niches</h1>
        <p className="text-lg text-muted-foreground">
          {formatNumber(total)} AI startups across {stats.length} niches. A startup can belong to
          several niches, so the counts add up to more than the total.
        </p>
      </div>

      <MarketMap stats={stats} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>Niche</TableHead>
            <TableHead className="text-right">Startups</TableHead>
            <TableHead className="hidden text-right sm:table-cell">Share of all</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.map((niche, i) => (
            <TableRow key={niche.slug}>
              <TableCell className="tabular-nums text-muted-foreground">{i + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span
                    className={cn("size-3 shrink-0 rounded-sm border", densityBand(niche.total).tile)}
                    aria-hidden="true"
                  />
                  <Link href={`/niche/${niche.slug}`} className="font-medium hover:underline underline-offset-4">
                    {niche.name}
                  </Link>
                </div>
                <p className="mt-0.5 hidden max-w-xl whitespace-normal text-muted-foreground md:block">
                  {niche.blurb}
                </p>
              </TableCell>
              <TableCell className="text-right tabular-nums">{formatNumber(niche.total)}</TableCell>
              <TableCell className="hidden text-right tabular-nums text-muted-foreground sm:table-cell">
                {((niche.total / total) * 100).toFixed(1)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
