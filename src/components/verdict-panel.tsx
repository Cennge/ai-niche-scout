import Link from "next/link"

import { CountUp } from "@/components/count-up"
import { ShareButton } from "@/components/share-button"
import type { Site } from "@/lib/freeserp"
import { formatNumber } from "@/lib/format"
import { getNicheByName } from "@/lib/niches"
import { cn } from "@/lib/utils"
import { getVerdict, VERDICTS } from "@/lib/verdict"

const LEVEL_FILL = ["bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"]

export function VerdictPanel({
  query,
  total,
  sample,
}: {
  query: string
  total: number
  sample: Site[]
}) {
  const verdict = getVerdict(total)
  const leaders = sample
    .filter((site) => site.dr != null)
    .sort((a, b) => (b.dr ?? 0) - (a.dr ?? 0))
    .slice(0, 3)

  return (
    <section
      aria-labelledby="verdict-heading"
      className="flex flex-col gap-4 rounded-xl border p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Verdict</p>
          <h2 id="verdict-heading" className="text-3xl font-bold tracking-tight">
            {verdict.label}
          </h2>
        </div>
        <ShareButton title={`“${query}” is ${verdict.label.toLowerCase()}: AI Niche Scout`} />
      </div>
      <div
        className="grid grid-cols-4 gap-1"
        role="meter"
        aria-label="Competition level"
        aria-valuemin={1}
        aria-valuemax={4}
        aria-valuenow={verdict.level}
        aria-valuetext={verdict.label}
      >
        {[...VERDICTS].reverse().map((v, i) => (
          <div key={v.label} className="flex flex-col gap-1.5">
            {/* Filled segments light up one after another, up to the verdict. */}
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              {i < verdict.level && (
                <div
                  className={cn("grow-x h-full rounded-full", LEVEL_FILL[i])}
                  style={{ "--delay": `${150 + i * 220}ms` } as React.CSSProperties}
                />
              )}
            </div>
            <span
              className={cn(
                "text-xs",
                i + 1 === verdict.level ? "font-medium" : "text-muted-foreground",
              )}
            >
              {v.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-lg">
        <span className="font-semibold">
          <CountUp value={total} /> {total === 1 ? "AI startup" : "AI startups"}
        </span>{" "}
        {total === 1 ? "matches" : "match"} this idea.
      </p>
      <p className="text-muted-foreground">{verdict.description}</p>
      {total < 20 && (
        <p className="text-sm text-muted-foreground">
          Few matches can also mean the description is very specific. Try fewer words to see the
          wider space.
        </p>
      )}
      {leaders.length > 0 && (
        <div className="mt-auto flex flex-col gap-2 border-t pt-4">
          <p className="text-sm text-muted-foreground">Most established players</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {leaders.map((site) => (
              <li key={site.domain} className="flex items-baseline gap-1.5">
                <Link
                  href={`/site/${site.domain}`}
                  translate="no"
                  className="font-medium hover:underline underline-offset-4"
                >
                  {site.domain}
                </Link>
                <span className="text-sm tabular-nums text-muted-foreground">DR {site.dr}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export function NicheBreakdown({ sample }: { sample: Site[] }) {
  const counts = new Map<string, number>()
  for (const site of sample) {
    for (const name of site.ai_categories ?? []) counts.set(name, (counts.get(name) ?? 0) + 1)
  }
  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
  if (!rows.length) return null

  return (
    <section
      aria-labelledby="breakdown-heading"
      className="flex flex-col gap-4 rounded-xl border p-5 sm:p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 id="breakdown-heading" className="text-lg font-semibold">
          Where the competitors are
        </h2>
        <p className="text-sm text-muted-foreground">
          Niches of the top {formatNumber(sample.length)} matches. A startup can be in several.
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {rows.map(([name, count], i) => {
          const niche = getNicheByName(name)
          const share = Math.round((count / sample.length) * 100)
          return (
            <li key={name} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                {niche ? (
                  <Link
                    href={`/niche/${niche.slug}`}
                    className="truncate hover:underline underline-offset-4"
                  >
                    {name}
                  </Link>
                ) : (
                  <span className="truncate">{name}</span>
                )}
                <span className="shrink-0 tabular-nums text-muted-foreground">{share}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted">
                <div
                  className="grow-x h-full rounded-full bg-primary"
                  style={
                    { width: `${share}%`, "--delay": `${250 + i * 90}ms` } as React.CSSProperties
                  }
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
