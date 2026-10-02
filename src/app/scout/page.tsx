import type { Metadata } from "next"
import { Suspense } from "react"
import { SearchX } from "lucide-react"

import { FiltersBar } from "@/components/filters-bar"
import { IdeaForm } from "@/components/idea-form"
import { ResultsPagination } from "@/components/results-pagination"
import { SiteList } from "@/components/site-list"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { NicheBreakdown, VerdictPanel } from "@/components/verdict-panel"
import { maxPage, parseFilters, toSearchParams } from "@/lib/filters"
import { getIndexedMonths, searchSites } from "@/lib/freeserp"
import { pluralize } from "@/lib/format"
import { getNicheBySlug } from "@/lib/niches"

export async function generateMetadata(props: PageProps<"/scout">): Promise<Metadata> {
  const filters = parseFilters(await props.searchParams)
  const q = filters.q
  const niche = filters.niche ? getNicheBySlug(filters.niche)?.name : undefined
  return {
    title: q
      ? `Competitors for "${q}"`
      : niche
        ? `Browse AI startups in ${niche}`
        : "Browse AI startups",
    description: q
      ? `AI startups that already build "${q}", with a verdict on how crowded the niche is.`
      : "Search and filter 33,000+ AI startups by niche, Domain Rating, domain zone and builder.",
    // Result pages are endless permutations: keep them out of the index, follow the links.
    robots: { index: false, follow: true },
  }
}

export default async function ScoutPage(props: PageProps<"/scout">) {
  const raw = await props.searchParams
  const filters = parseFilters(raw)
  const niche = filters.niche ? getNicheBySlug(filters.niche) : undefined

  const [list, sample, indexedOptions] = await Promise.all([
    searchSites(toSearchParams(filters)),
    // The verdict always describes the idea itself, regardless of the filters applied below.
    filters.q ? searchSites({ q: filters.q, size: 100 }) : null,
    getIndexedMonths(),
  ])

  const heading = filters.q
    ? `“${filters.q}”`
    : niche
      ? `AI startups in ${niche.name}`
      : "Browse AI startups"

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4">
        <IdeaForm defaultValue={filters.q} size="default" />
        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">{heading}</h1>
      </div>

      {sample && (
        <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
          <VerdictPanel total={sample.total} sample={sample.results} />
          <NicheBreakdown sample={sample.results} />
        </div>
      )}

      <section aria-labelledby="results-heading" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="results-heading" className="text-2xl font-semibold tracking-tight">
            {filters.q ? "Competitors" : "Startups"}
          </h2>
          <p className="text-muted-foreground" aria-live="polite">
            {pluralize(list.total, "startup")} with the current filters.
          </p>
        </div>

        <Suspense>
          <FiltersBar hasQuery={Boolean(filters.q)} indexedOptions={indexedOptions} />
        </Suspense>

        {list.results.length ? (
          <SiteList sites={list.results} />
        ) : (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchX />
              </EmptyMedia>
              <EmptyTitle>No startups match these filters</EmptyTitle>
              <EmptyDescription>
                Remove a filter or describe the idea in fewer words.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        <ResultsPagination
          pathname="/scout"
          searchParams={raw}
          page={filters.page}
          lastPage={maxPage(list.total)}
        />
      </section>
    </div>
  )
}
