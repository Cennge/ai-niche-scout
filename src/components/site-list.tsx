import Image from "next/image"
import Link from "next/link"

import { CompareToggle } from "@/components/compare-toggle"
import { Badge } from "@/components/ui/badge"
import type { Site } from "@/lib/freeserp"
import { builderLabel, formatDate } from "@/lib/format"
import { getNicheByName } from "@/lib/niches"

export function SiteFavicon({ domain, size = 32 }: { domain: string; size?: number }) {
  return (
    <Image
      src={`/api/favicon?d=${encodeURIComponent(domain)}`}
      alt=""
      width={size}
      height={size}
      unoptimized
      className="shrink-0 self-start rounded-md border bg-muted object-contain"
      style={{ width: size, height: size }}
    />
  )
}

export function NicheBadges({ categories }: { categories: string[] | null }) {
  if (!categories?.length) return null
  return (
    <ul className="flex flex-wrap gap-1.5">
      {categories.map((name) => {
        const niche = getNicheByName(name)
        return (
          <li key={name}>
            {niche ? (
              <Badge variant="outline" asChild>
                <Link href={`/niche/${niche.slug}`}>{name}</Link>
              </Badge>
            ) : (
              <Badge variant="outline">{name}</Badge>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function SiteRow({ site }: { site: Site }) {
  const builder = builderLabel(site.ai_source)

  return (
    <li className="flex flex-col gap-3 py-5 sm:flex-row sm:gap-4">
      <SiteFavicon domain={site.domain} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-semibold">
            <Link href={`/site/${site.domain}`} translate="no" className="break-all hover:underline underline-offset-4">
              {site.domain}
            </Link>
          </h3>
          {site.title && <p className="truncate text-sm text-muted-foreground">{site.title}</p>}
        </div>
        {site.ai_summary && (
          <p className="line-clamp-2 max-w-prose text-sm leading-relaxed">{site.ai_summary}</p>
        )}
        <NicheBadges categories={site.ai_categories} />
      </div>
      <div className="flex shrink-0 flex-row flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:w-44 sm:flex-col sm:items-end sm:text-right">
        <dl className="flex gap-4 sm:flex-col sm:gap-1">
          <div>
            <dt className="sr-only">Domain Rating</dt>
            <dd className="tabular-nums">{site.dr != null ? `DR ${site.dr}` : "No DR yet"}</dd>
          </div>
          <div>
            <dt className="sr-only">Indexed</dt>
            <dd className="text-muted-foreground">Indexed {formatDate(site.went_live)}</dd>
          </div>
          {builder && (
            <div>
              <dt className="sr-only">Built with</dt>
              <dd className="text-muted-foreground">{builder}</dd>
            </div>
          )}
        </dl>
        <CompareToggle domain={site.domain} />
      </div>
    </li>
  )
}

export function SiteList({ sites }: { sites: Site[] }) {
  return (
    <ul className="divide-y border-y">
      {sites.map((site) => (
        <SiteRow key={site.domain} site={site} />
      ))}
    </ul>
  )
}
