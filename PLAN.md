# AI Niche Scout — Site Plan

## Goal

Help people decide whether an AI product idea is worth building. A visitor describes an idea and in a few seconds sees who already builds it, how crowded the niche is, and where the gaps are, using live data from the FreeSerp sites index (homepage profiles of AI startups).

Success criteria for the MVP:

- The user gets a useful answer within 10 seconds of landing on the site: competitors, their count, and a niche verdict.
- Every page is server-rendered, indexable and shareable: state lives in the URL.
- The site works in light and dark themes on mobile and desktop.

## Audience

| Who | What they need | Where they go |
|---|---|---|
| Indie founders, hackathon teams | "Is my idea taken? Who are the competitors?" | Home → Scout results |
| Marketers, SEO and content people | "Which AI niches are growing, which sites lead them?" | Market map → Niche pages |
| Investors, analysts, journalists | "What is the AI startup landscape in niche X?" | Niche pages, Compare |
| Developers looking for tools | "Find an AI tool for X" | Scout search, Site pages |

## Data source

FreeSerp API, `index=sites` (main pages only), always filtered with `ai_startups=1` to drop noise such as shops and casinos. Data snapshot as of 2026-10-02:

- 33,570 AI startups across 54 sub-niches (`ai_categories`), from "AI Agents & Autonomous" (10.5k) to "Background Removal" (22).
- Fields used: `domain`, `title`, `ai_summary`, `ai_categories`, `dr`, `went_live`, `tld`, `ai_source`, `webserver`.

Known limitations. We surface these in the UI instead of hiding them:

- `went_live` is the date FreeSerp first saw the site live, not its official launch date.
- Most profiles were added in August 2026 and the newest are from 2026-09-08, so "new" means recently indexed.
- About 80% of fresh startups have no Domain Rating yet, so DR works as an optional filter, never as the default sort.
- The API has no facet endpoint, so niche counts are fetched per niche and cached.

## Pages and structure

```
/                      Home: idea input, market map, freshly indexed startups
/scout?q=…             Idea results: verdict, competitors, niche breakdown, filters
                       (without q: browse all startups, e.g. /scout?niche=legal)
/niches                All 54 niches: map and sortable table
/niche/[slug]          One niche: stats, leaders, newest, similar niches (54 pre-rendered pages)
/site/[domain]         One startup: summary, facts, similar startups
/compare?d=a,b,c       2–3 startups side by side
/about                 Data and methodology: how verdicts are computed, limitations
```

### Home `/`

1. Hero: "Describe your AI idea" input with example chips ("AI voice receptionist for clinics", "RAG over PDFs"…), and a live counter of tracked startups.
2. AI market map: a treemap of 54 niches sized by startup count. Clicking a tile opens the niche page.
3. Freshly indexed: the latest startups by `went_live`, with a link to all.

### Scout results `/scout?q=`

- Verdict card: competitor count (`total` for `q` + `ai_startups=1`) mapped to a label. Thresholds are a heuristic and are documented on /about.
  - Open field: fewer than 20
  - Emerging: 20–199
  - Competitive: 200–999
  - Crowded: 1000+
- Niche breakdown: which `ai_categories` the matching startups fall into. Computed from the result set.
- Competitor list: rows with domain, title, summary, niches, DR and date. Filters (niche, DR, indexed month, TLD, builder), sort (best match, newest, oldest, DR) and pagination.
- Without `q` the same page is the filterable browser for all startups, so niche pages can stay static.
- "Add to compare" on every card.

### Niches `/niches` and `/niche/[slug]`

- The index shows the treemap plus a table sorted by size.
- A niche page shows the startup count and rank, share of all AI startups, top site by DR, the most common domain zone, the 10 leaders by DR, the newest arrivals and niches of a similar size. "Browse and filter" opens `/scout?niche=<slug>`.
- All 54 pages are generated at build time and revalidated daily (ISR). Each has its own title, description and Open Graph tags. This is programmatic SEO.

### Site `/site/[domain]`

- The full `ai_summary`, niches, DR, `went_live`, TLD, builder, web server, and an outbound link. `first_seen` is left out: it is 2025-01-01 for every site.
- Similar startups: a search by the site's title within its main niche, excluding itself.

### Compare `/compare?d=`

- A table with one column per startup: summary, niches, DR, dates, stack. Startups are picked from cards anywhere on the site, and the selection is stored in the URL.

### About `/about`

- What the data is, how verdicts and counts are computed, and known limitations.

## Navigation

The header holds the logo, Scout, Niches, Compare (with a badge showing how many startups are selected), About and the theme toggle. The footer holds the data credit to FreeSerp and a GitHub link.

## Architecture

- Next.js (App Router) and shadcn/ui (Radix, Nova preset), Tailwind v4, deployed on Vercel.
- `src/lib/freeserp.ts` is the single typed API client. It sends identification params (`project`) and uses `fetch` caching with `revalidate`. Niche totals are cached for 24 hours.
- Pages are Server Components that read `searchParams`. Filters are small client components that only update the URL. No client-side data fetching is needed for core flows.
- Light and dark themes come from `next-themes` and shadcn semantic tokens.
- SSGOI page transitions (drill) for overview → niche page and list → site profile. They are turned off when `prefers-reduced-motion` is set.

## SEO

- Per-page `generateMetadata`, canonical URLs, and Open Graph and Twitter tags.
- `sitemap.ts` covers static pages and all 54 niche pages. `robots.ts` is included.
- Semantic HTML, a single h1 per page, and JSON-LD `ItemList` on niche pages.
- Performance budget: Lighthouse 90+ on mobile.

## Out of scope for the MVP

- Accounts, saved searches, alerts.
- News about startups (FreeSerp's companion freenewsapi.ai would fit here).
- Trend charts over time: the data window is too short for now.
