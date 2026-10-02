import Link from "next/link"

import { ModeToggle } from "@/components/mode-toggle"
import { SiteNav } from "@/components/site-nav"

export function LogoMark({ className }: { className?: string }) {
  // Contour lines around a peak: the "map" in market map.
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M12 3.5c4.8 0 8.5 3.6 8.5 8.3 0 4.6-3.9 8.7-8.6 8.7-4.6 0-8.4-3.9-8.4-8.5 0-4.8 3.7-8.5 8.5-8.5Z" stroke="currentColor" strokeWidth="1.5" opacity=".45" />
      <path d="M12.4 7c2.6 0 4.6 2.1 4.6 4.7 0 2.7-2.2 5-4.9 5-2.6 0-4.6-2.2-4.6-4.8C7.5 9.1 9.6 7 12.4 7Z" stroke="currentColor" strokeWidth="1.5" opacity=".75" />
      <circle cx="12.3" cy="11.8" r="1.9" fill="currentColor" />
    </svg>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <LogoMark className="size-6 text-primary" />
          AI Niche Scout
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <SiteNav />
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
