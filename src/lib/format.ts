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
