@AGENTS.md

# AI Niche Scout — project rules

Read `PLAN.md` before starting any feature: it is the source of truth for pages, data and scope.

## Stack

- Next.js 16 App Router, TypeScript, Tailwind v4, shadcn/ui (Radix base, Nova preset), lucide icons, next-themes.
- npm only. UI text is in English.

## Skills to use

- `shadcn`: every UI change. Add components through the CLI or the shadcn MCP, never hand-write a component that exists in the registry.
- `vercel-react-best-practices`: data fetching, server/client boundaries, bundle size.
- `frontend-design`: only for typography, palette and the hero/market map look. Components stay stock shadcn.
- `web-design-guidelines`: run as a review before a feature is called done.

## FreeSerp API rules

- All requests go through `src/lib/freeserp.ts`. No ad-hoc `fetch` to freeserp elsewhere.
- Always pass `ai_startups=1` and `project=ai-niche-scout`.
- Fetch on the server with `next: { revalidate }` caching. Do not fetch from the browser.
- Never present `went_live` as a launch date. Label it "Indexed" or "Live since".

## Conventions

- Server Components by default. `"use client"` only for interactive controls.
- Page state such as filters, sort, page and the compare selection lives in the URL search params.
- Use semantic color tokens only (`bg-background`, `text-muted-foreground`…). Check every new view in both light and dark themes.
- Every page exports metadata (title, description, Open Graph).

## Done means

- `npm run lint`, `npm test` and `npm run build` pass.
- The view has been checked in the browser in both themes and at mobile width.

## Git

- Small commits with clear messages. Never add Co-Authored-By or any AI attribution to commits or PRs.
