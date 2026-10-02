"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"

import { useCompare } from "@/components/compare-store"
import { Button } from "@/components/ui/button"
import { compareHref, MAX_COMPARE } from "@/lib/compare"

// Floating summary of the compare selection, so picking startups has a visible result.
export function CompareBar() {
  const pathname = usePathname()
  const { domains, replace } = useCompare()

  if (domains.length === 0 || pathname === "/compare") return null

  return (
    <>
      {/* Keeps the footer reachable above the fixed bar. */}
      <div className="h-20" aria-hidden="true" />
      <div
        role="region"
        aria-label="Compare selection"
        className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pb-[env(safe-area-inset-bottom)] animate-in fade-in slide-in-from-bottom-4 duration-200 motion-reduce:animate-none"
      >
        <div className="flex max-w-full items-center gap-3 rounded-xl border bg-popover py-2 pr-2 pl-3 text-popover-foreground shadow-lg">
          <div className="flex -space-x-2" aria-hidden="true">
            {domains.map((domain) => (
              // eslint-disable-next-line @next/next/no-img-element -- tiny proxied favicons, no optimisation needed
              <img
                key={domain}
                src={`/api/favicon?d=${encodeURIComponent(domain)}`}
                alt=""
                width={24}
                height={24}
                className="size-6 rounded-md border-2 border-popover bg-muted object-contain"
              />
            ))}
          </div>
          <p className="text-sm whitespace-nowrap">
            <span className="font-medium">{domains.length}</span>
            <span className="text-muted-foreground"> of {MAX_COMPARE} selected</span>
          </p>
          <Button asChild size="sm">
            <Link href={compareHref(domains)}>Compare</Link>
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Clear selection" onClick={() => replace([])}>
            <X />
          </Button>
        </div>
      </div>
    </>
  )
}
