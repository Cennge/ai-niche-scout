"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { useCompare } from "@/components/compare-store"
import { compareHref } from "@/lib/compare"

// Keeps the compare page URL and the stored selection in step:
// a shared link fills the selection, and later changes rewrite the URL.
export function CompareSync({ urlDomains }: { urlDomains: string[] }) {
  const router = useRouter()
  const { domains, replace } = useCompare()
  const adopted = React.useRef(false)

  React.useEffect(() => {
    if (!adopted.current) {
      adopted.current = true
      if (urlDomains.length) {
        replace(urlDomains)
        return
      }
    }
    if (domains.join(",") !== urlDomains.join(",")) {
      router.replace(compareHref(domains), { scroll: false })
    }
  }, [domains, urlDomains, replace, router])

  return null
}
