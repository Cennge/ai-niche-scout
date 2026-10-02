import Link from "next/link"

import { LogoMark } from "@/components/site-header"
import { NICHES } from "@/lib/niches"

// NICHES is ordered by size, so the first entries are the busiest niches.
const POPULAR = NICHES.slice(0, 8)

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <nav aria-label={title} className="flex flex-col gap-3">
      <h2 className="text-sm font-medium">{title}</h2>
      <ul className="flex flex-col gap-2 text-sm text-muted-foreground">{children}</ul>
    </nav>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http")
  return (
    <li>
      {external ? (
        <a href={href} className="hover:text-foreground">
          {children}
        </a>
      ) : (
        <Link href={href} className="hover:text-foreground">
          {children}
        </Link>
      )}
    </li>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex max-w-xs flex-col gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <LogoMark className="size-6 text-primary" />
            AI Niche Scout
          </Link>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Check an AI startup idea against 33,000+ AI products before you build it.
          </p>
        </div>

        <FooterColumn title="Popular niches">
          {POPULAR.map((niche) => (
            <FooterLink key={niche.slug} href={`/niche/${niche.slug}`}>
              {niche.name}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Explore">
          <FooterLink href="/">Scout an idea</FooterLink>
          <FooterLink href="/niches">All 54 niches</FooterLink>
          <FooterLink href="/scout?sort=went_live">Recently indexed</FooterLink>
          <FooterLink href="/compare">Compare startups</FooterLink>
        </FooterColumn>

        <FooterColumn title="Data">
          <FooterLink href="/about">About the data</FooterLink>
          <FooterLink href="https://freeserp.ai">FreeSerp sites index</FooterLink>
          <FooterLink href="https://freeserp.ai/docs.php">FreeSerp API docs</FooterLink>
          <FooterLink href="https://github.com/Cennge/ai-niche-scout">Source on GitHub</FooterLink>
        </FooterColumn>
      </div>
      <div className="border-t">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-sm text-muted-foreground sm:px-6">
          Startup data from FreeSerp, refreshed daily. Summaries are machine-written from each homepage.
        </p>
      </div>
    </footer>
  )
}
