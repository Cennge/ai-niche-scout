import type { Metadata } from "next"
import Link from "next/link"

import { getTotalStartups } from "@/lib/freeserp"
import { formatNumber } from "@/lib/format"
import { VERDICTS } from "@/lib/verdict"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "About the data",
  description:
    "Where AI Niche Scout gets its data, how competitor verdicts are calculated, and the known limits of the dataset.",
  alternates: { canonical: "/about" },
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h2 id={id} className="text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="flex flex-col gap-3 leading-relaxed text-muted-foreground [&_strong]:font-medium [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  )
}

export default async function AboutPage() {
  const total = await getTotalStartups()
  const ascending = [...VERDICTS].reverse()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About the data</h1>
        <p className="text-lg text-muted-foreground">
          AI Niche Scout is a thin, honest layer over a public dataset. Here is what it can and cannot
          tell you.
        </p>
      </div>

      <Section id="source" title="Where the data comes from">
        <p>
          Every number on this site comes from the{" "}
          <a href="https://freeserp.ai/docs.php" className="underline underline-offset-4 hover:text-foreground">
            FreeSerp API
          </a>
          , a free search index of website homepages. We use its sites index and keep only{" "}
          <strong>genuine AI products</strong> (the <code>ai_startups</code> filter), which removes shops,
          casinos and directories that merely mention AI. That leaves{" "}
          <strong>{formatNumber(total)} AI startups</strong>.
        </p>
        <p>
          For each site FreeSerp stores a short summary written by a language model, one or more of 54 AI
          niches, a Domain Rating from 0 to 100, the domain zone, the technology it is built with and the
          date it was confirmed live.
        </p>
      </Section>

      <Section id="verdict" title="How the verdict works">
        <p>
          When you scout an idea, we search summaries, titles and homepage text for your words and count
          the AI startups that match. The count maps to a verdict:
        </p>
        <ul className="flex flex-col gap-2">
          {ascending.map((v, i) => {
            const next = ascending[i + 1]
            const range = next
              ? `${formatNumber(v.min)}–${formatNumber(next.min - 1)}`
              : `${formatNumber(v.min)}+`
            return (
              <li key={v.label}>
                <strong>{v.label}</strong> ({range} matches). {v.description}
              </li>
            )
          })}
        </ul>
        <p>
          The search matches all of your words, so a long, specific description finds fewer sites than a
          short one. Scout the core of the idea first, then narrow it down.
        </p>
      </Section>

      <Section id="limits" title="Known limits">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>
            <strong>&quot;Indexed&quot; is not a launch date.</strong> It is the day FreeSerp first
            confirmed the site was live. Most profiles were added in August 2026, so many older companies
            show a recent date.
          </li>
          <li>
            <strong>Most new startups have no Domain Rating yet.</strong> Sorting by DR favours established
            sites. Use it to find leaders, not newcomers.
          </li>
          <li>
            <strong>Niches overlap.</strong> A startup can sit in several niches, so niche counts add up to
            more than the total.
          </li>
          <li>
            <strong>Summaries are machine-written</strong> from each homepage and can be out of date.
          </li>
          <li>
            <strong>Shares on niche pages</strong> (most common builder and zone) are calculated from the 100
            highest-rated sites in that niche.
          </li>
        </ul>
      </Section>

      <Section id="freshness" title="How fresh it is">
        <p>
          Niche counts are cached for a day, search results for an hour. The 54 niche pages are generated
          ahead of time and refreshed daily, so they load instantly and search engines can index them.
        </p>
        <p>
          <Link href="/niches" className="underline underline-offset-4 hover:text-foreground">
            Explore the niches
          </Link>{" "}
          or{" "}
          <Link href="/" className="underline underline-offset-4 hover:text-foreground">
            scout an idea
          </Link>
          .
        </p>
      </Section>
    </div>
  )
}
