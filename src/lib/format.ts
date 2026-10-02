const numberFormat = new Intl.NumberFormat("en-US")
const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export function formatNumber(value: number) {
  return numberFormat.format(value)
}

export function formatDate(value: string | null) {
  if (!value) return "Unknown"
  const date = new Date(`${value}T00:00:00Z`)
  return Number.isNaN(date.getTime()) ? value : dateFormat.format(date)
}

/** Shortens text to at most `max` characters at a word boundary, adding an ellipsis. */
export function clampText(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const space = cut.lastIndexOf(" ")
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,.;:|–—-]+$/, "")}…`
}

export function pluralize(count: number, one: string, many = `${one}s`) {
  return `${formatNumber(count)} ${count === 1 ? one : many}`
}

// `ai_source` values that are worth showing to people. Others (e.g. "not_ai") stay hidden.
export const BUILDERS: Record<string, string> = {
  lovable: "Lovable",
  v0: "v0",
  bolt: "Bolt",
  base44: "Base44",
  ai_likely: "AI-generated",
  nextjs: "Next.js",
  wordpress: "WordPress",
  shopify: "Shopify",
}

export function builderLabel(source: string | null) {
  if (!source) return null
  return BUILDERS[source] ?? null
}
