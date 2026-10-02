import Link from "next/link"

import { ExampleIdeas, IdeaForm } from "@/components/idea-form"
import { MarketMap } from "@/components/market-map"
import { SiteList } from "@/components/site-list"
import { Button } from "@/components/ui/button"
import { getNicheStats, getTotalStartups, searchSites } from "@/lib/freeserp"
import { formatNumber } from "@/lib/format"

export const revalidate = 3600

export default async function Home() {
  const [total, stats, fresh] = await Promise.all([
    getTotalStartups(),
    getNicheStats(),
    searchSites({ sort: "went_live", order: "desc", size: 6 }),
  ])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 sm:py-16">
      <section className="flex max-w-3xl flex-col gap-6">
        <h1 className="text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">
          Is your AI idea already taken?
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Describe it in a few words. We search {formatNumber(total)} AI startups and show who
          already builds it and how crowded the niche is.
        </p>
        <IdeaForm />
        <ExampleIdeas />
      </section>

      <section aria-labelledby="map-heading" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <h2 id="map-heading" className="text-2xl font-semibold tracking-tight">
              The AI market at a glance
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              {stats.length} niches, each sized by its number of startups. Open one to see who is in it.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/niches">All niches</Link>
          </Button>
        </div>
        <MarketMap stats={stats} />
      </section>

      <section aria-labelledby="fresh-heading" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <h2 id="fresh-heading" className="text-2xl font-semibold tracking-tight">
              Recently indexed
            </h2>
            <p className="text-muted-foreground">
              The newest AI startups FreeSerp has confirmed live.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/scout?sort=went_live">Browse all startups</Link>
          </Button>
        </div>
        <SiteList sites={fresh.results} />
      </section>
    </div>
  )
}
