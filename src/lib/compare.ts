// Shared by the client compare store and the server-rendered compare page.

export const MAX_COMPARE = 3

export function compareHref(domains: string[]) {
  return domains.length ? `/compare?d=${domains.map(encodeURIComponent).join(",")}` : "/compare"
}
