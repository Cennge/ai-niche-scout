import type { Metadata } from "next"
import Link from "next/link"
import { Columns3 } from "lucide-react"

import { CompareToggle } from "@/components/compare-toggle"
import { NicheBadges, SiteFavicon } from "@/components/site-list"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { CompareSync } from "@/components/compare-sync"
import { MAX_COMPARE } from "@/lib/compare"
import { getSite, type Site } from "@/lib/freeserp"
import { builderLabel, formatDate } from "@/lib/format"

export const metadata: Metadata = {
  title: "Compare AI startups",
  description: "Put up to three AI startups side by side: summary, niches, Domain Rating, dates and stack.",
  robots: { index: false, follow: true },
}

const ROWS: { label: string; render: (site: Site) => React.ReactNode }[] = [
  { label: "What it does", render: (s) => <p className="leading-relaxed">{s.ai_summary ?? "No summary"}</p> },
  { label: "Niches", render: (s) => <NicheBadges categories={s.ai_categories} /> },
  { label: "Domain Rating", render: (s) => (s.dr != null ? s.dr : "Not rated yet") },
  { label: "Indexed", render: (s) => formatDate(s.went_live) },
  { label: "Domain zone", render: (s) => (s.tld ? `.${s.tld}` : "Unknown") },
  { label: "Built with", render: (s) => builderLabel(s.ai_source) ?? "Unknown" },
  { label: "Hosting", render: (s) => s.webserver ?? "Unknown" },
]

export default async function ComparePage(props: PageProps<"/compare">) {
  const { d } = await props.searchParams
  const domains = [...new Set((typeof d === "string" ? d : "").split(",").map((x) => x.trim().toLowerCase()))]
    .filter(Boolean)
    .slice(0, MAX_COMPARE)
  const sites = (await Promise.all(domains.map((domain) => getSite(domain)))).filter((s): s is Site => s !== null)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
      <CompareSync urlDomains={domains} />
      <div className="flex max-w-3xl flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Compare startups</h1>
        <p className="text-lg text-muted-foreground">
          Pick up to {MAX_COMPARE} startups with the Compare button anywhere on the site.
        </p>
      </div>

      {sites.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Columns3 />
            </EmptyMedia>
            <EmptyTitle>Nothing to compare yet</EmptyTitle>
            <EmptyDescription>
              Scout an idea or open a niche, then press Compare on two or three startups.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/scout?sort=went_live">Browse startups</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[640px] table-fixed text-sm">
            <caption className="sr-only">Side-by-side comparison of selected startups</caption>
            <thead>
              <tr className="border-b">
                <th scope="col" className="w-36 p-4 text-left font-normal text-muted-foreground">
                  <span className="sr-only">Attribute</span>
                </th>
                {sites.map((site) => (
                  <th key={site.domain} scope="col" className="p-4 text-left align-top">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <SiteFavicon domain={site.domain} />
                        <Link href={`/site/${site.domain}`} translate="no" className="truncate text-base font-semibold hover:underline underline-offset-4">
                          {site.domain}
                        </Link>
                      </div>
                      <div>
                        <CompareToggle domain={site.domain} />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-b last:border-b-0">
                  <th scope="row" className="p-4 text-left align-top font-normal text-muted-foreground">
                    {row.label}
                  </th>
                  {sites.map((site) => (
                    <td key={site.domain} className="p-4 align-top">
                      {row.render(site)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
