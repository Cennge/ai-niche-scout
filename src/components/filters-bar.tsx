"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"

import { useResultsTransition } from "@/components/results-transition"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { DR_OPTIONS, SORT_OPTIONS, TLDS } from "@/lib/filter-options"
import { BUILDERS } from "@/lib/format"
import { NICHES } from "@/lib/niches"

const ANY = "any"
const FILTER_KEYS = ["niche", "dr", "indexed", "tld", "builder", "sort"]

type Option = { value: string; label: string }

function FilterSelect({
  id,
  label,
  value,
  options,
  anyLabel,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: Option[]
  anyLabel?: string
  onChange: (value: string) => void
}) {
  return (
    <Field className="min-w-0">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {anyLabel && <SelectItem value={ANY}>{anyLabel}</SelectItem>}
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}

export function FiltersBar({
  hasQuery,
  indexedOptions,
}: {
  hasQuery: boolean
  indexedOptions: Option[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { pending, startTransition } = useResultsTransition()

  const get = (key: string) => searchParams.get(key) ?? ANY

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value === ANY) next.delete(key)
    else next.set(key, value)
    next.delete("page")
    startTransition(() => router.push(`${pathname}?${next}`, { scroll: false }))
  }

  const clear = () => {
    const next = new URLSearchParams(searchParams)
    FILTER_KEYS.forEach((key) => next.delete(key))
    next.delete("page")
    startTransition(() => router.push(`${pathname}?${next}`, { scroll: false }))
  }

  const active = FILTER_KEYS.some((key) => key !== "sort" && searchParams.has(key))
  const sortOptions = hasQuery ? SORT_OPTIONS : SORT_OPTIONS.filter((o) => o.value !== "relevance")
  const defaultSort = hasQuery ? "relevance" : "dr"

  return (
    <section aria-label="Filters" className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <FilterSelect
          id="filter-niche"
          label="Niche"
          value={get("niche")}
          anyLabel="All niches"
          options={NICHES.map((n) => ({ value: n.slug, label: n.name }))}
          onChange={(v) => update("niche", v)}
        />
        <FilterSelect
          id="filter-dr"
          label="Domain Rating"
          value={get("dr")}
          anyLabel="Any"
          options={DR_OPTIONS}
          onChange={(v) => update("dr", v)}
        />
        <FilterSelect
          id="filter-indexed"
          label="Indexed"
          value={get("indexed")}
          anyLabel="Any time"
          options={indexedOptions}
          onChange={(v) => update("indexed", v)}
        />
        <FilterSelect
          id="filter-tld"
          label="Domain zone"
          value={get("tld")}
          anyLabel="Any"
          options={TLDS.map((t) => ({ value: t, label: `.${t}` }))}
          onChange={(v) => update("tld", v)}
        />
        <FilterSelect
          id="filter-builder"
          label="Built with"
          value={get("builder")}
          anyLabel="Anything"
          options={Object.entries(BUILDERS).map(([value, label]) => ({ value, label }))}
          onChange={(v) => update("builder", v)}
        />
        <FilterSelect
          id="filter-sort"
          label="Sort by"
          value={searchParams.get("sort") ?? defaultSort}
          options={sortOptions}
          onChange={(v) => update("sort", v === defaultSort ? ANY : v)}
        />
      </div>
      <div className="flex min-h-8 items-center gap-3">
        {active && (
          <Button variant="ghost" size="sm" onClick={clear}>
            <X data-icon="inline-start" />
            Clear filters
          </Button>
        )}
        {pending && (
          <span className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
            <Spinner />
            Updating results…
          </span>
        )}
      </div>
    </section>
  )
}
