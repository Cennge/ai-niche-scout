import type { NextRequest } from "next/server"

// Favicon proxy: fetches the icon server-side and caches it for a day. Missing icons
// fall back to a lettered tile, so the browser never logs a 404 and visitors' browsers
// never contact the favicon service directly.

const DOMAIN = /^(?=.{1,253}$)([a-z0-9-]{1,63}\.)+[a-z]{2,63}$/i
const CACHE = "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800"

function fallback(domain: string) {
  const letter = (domain.match(/[a-z0-9]/i)?.[0] ?? "?").toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#8a9a92" fill-opacity=".18"/><text x="32" y="42" font-family="system-ui,sans-serif" font-size="30" font-weight="600" text-anchor="middle" fill="#5b6b63">${letter}</text></svg>`
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": CACHE } })
}

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("d")?.toLowerCase() ?? ""
  if (!DOMAIN.test(domain)) return fallback("?")

  try {
    const res = await fetch(
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`,
      { next: { revalidate: 86400 } },
    )
    const type = res.headers.get("content-type") ?? ""
    if (!res.ok || !type.startsWith("image/")) return fallback(domain)
    return new Response(await res.arrayBuffer(), {
      headers: { "Content-Type": type, "Cache-Control": CACHE },
    })
  } catch {
    return fallback(domain)
  }
}
