import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { densityBand } from "@/components/market-map"
import { SiteList } from "@/components/site-list"
import { Button } from "@/components/ui/button"
import { getNicheStats, getTotalStartups, searchSites, type Site } from "@/lib/freeserp"
import { formatNumber } from "@/lib/format"
import { getNicheBySlug, NICHES } from "@/lib/niches"
import { SITE_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

export const revalidate = 86400
export const dynamicParams = false

export function generateStaticParams() {
  return NICHES.map((niche) => ({ slug: niche.slug }))
}

export async function generateMetadata(props: PageProps<"/niche/[slug]">): Promise<Metadata> {
  const { slug } = await props.params
  const niche = getNicheBySlug(slug)
  if (!niche) return {}
  const stat = (await getNicheStats()).find((s) => s.slug === slug)
  const count = stat ? formatNumber(stat.total) : "All"
  return {
    title: `${niche.name}: ${count} AI startups`,
    description: `${niche.blurb} Browse ${count} AI startups in ${niche.name}, with Domain Rating, launch data and similar niches.`,
    alternates: { canonical: `/niche/${slug}` },
    openGraph: { title: `${count} AI startups in ${niche.name}`, url: `/niche/${slug}` },
  }
}

function topShares(sites: Site[], pick: (site: Site) => string | null, limit = 4) {
  const counts = new Map<string, number>()
  for (const site of sites) {
    const key = pick(site)
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, share: Math.round((count / sites.length) * 100) }))
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-1 border-l pl-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="truncate text-2xl font-semibold">{value}</dd>
      {hint && <dd className="text-sm text-muted-foreground">{hint}</dd>}
    </div>
  )
}

export default async function NichePage(props: PageProps<"/niche/[slug]">) {
  const { slug } = await props.params
  const niche = getNicheBySlug(slug)
  if (!niche) notFound()

  const [stats, total, leaders, newest] = await Promise.all([
    getNicheStats(),
    getTotalStartups(),
    searchSites({ niche: niche.name, sort: "dr", order: "desc", size: 100 }, 86400),
    searchSites({ niche: niche.name, sort: "went_live", order: "desc", size: 5 }, 86400),
  ])
  const index = stats.findIndex((s) => s.slug === slug)
  const count = stats[index]?.total ?? leaders.total

  const leader = leaders.results[0]
  const zones = topShares(leaders.results, (s) => (s.tld ? `.${s.tld}` : null))
  const neighbours = stats.filter((s) => s.slug !== slug).slice(Math.max(0, index - 3), Math.max(0, index - 3) + 6)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `AI startups in ${niche.name}`,
    numberOfItems: count,
    itemListElement: leaders.results.slice(0, 10).map((site, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/site/${site.domain}`,
      name: site.domain,
    })),
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="flex flex-col gap-6">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link href="/niches" className="hover:text-foreground">
            AI niches
          </Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{niche.name}</span>
        </nav>
        <div className="flex max-w-3xl flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-5xl">{niche.name}</h1>
          <p className="text-lg text-muted-foreground">{niche.blurb}</p>
        </div>
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <Stat label="AI startups" value={formatNumber(count)} hint={`Rank ${index + 1} of ${stats.length}`} />
          <Stat label="Share of all AI startups" value={`${((count / total) * 100).toFixed(1)}%`} />
          <Stat
            label="Top site by DR"
            value={leader?.domain ?? "Unknown"}
            hint={leader?.dr != null ? `Domain Rating ${leader.dr}` : undefined}
          />
          <Stat
            label="Most common zone"
            value={zones[0]?.label ?? "Unknown"}
            hint={zones[0] ? `${zones[0].share}% of the top 100` : undefined}
          />
        </dl>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={`/scout?niche=${slug}`}>Browse and filter all {formatNumber(count)}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/scout?niche=${slug}&sort=went_live`}>Newest in this niche</Link>
          </Button>
        </div>
      </div>

      <section aria-labelledby="leaders-heading" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="leaders-heading" className="text-2xl font-semibold tracking-tight">
            Leaders by Domain Rating
          </h2>
          <p className="text-muted-foreground">The most established sites in {niche.name}.</p>
        </div>
        <SiteList sites={leaders.results.slice(0, 10)} />
      </section>

      <section aria-labelledby="newest-heading" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="newest-heading" className="text-2xl font-semibold tracking-tight">
            Recently indexed
          </h2>
          <p className="text-muted-foreground">New arrivals that FreeSerp confirmed live most recently.</p>
        </div>
        <SiteList sites={newest.results} />
      </section>

      <section aria-labelledby="neighbours-heading" className="flex flex-col gap-4">
        <h2 id="neighbours-heading" className="text-2xl font-semibold tracking-tight">
          Niches of a similar size
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {neighbours.map((n) => (
            <li key={n.slug}>
              <Link
                href={`/niche/${n.slug}`}
                className="flex items-center justify-between gap-3 rounded-lg border p-3 hover:bg-muted"
              >
                <span className="flex items-center gap-2">
                  <span className={cn("size-3 shrink-0 rounded-sm border", densityBand(n.total).tile)} aria-hidden="true" />
                  {n.name}
                </span>
                <span className="tabular-nums text-muted-foreground">{formatNumber(n.total)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
