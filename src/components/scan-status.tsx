"use client"

import { useSearchParams } from "next/navigation"

// Loading state for a scout: a radar sweep over the contour map, naming what is being scanned.
export function ScanStatus() {
  const q = useSearchParams().get("q")?.trim()

  return (
    <div className="relative isolate flex min-h-64 flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border px-6 py-12 text-center">
      <div className="contours pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <div
        className="radar-sweep pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        aria-hidden="true"
      />
      <p role="status" className="text-lg font-semibold">
        {q ? `Scanning for “${q}”…` : "Scanning AI startups…"}
      </p>
      <p className="max-w-md text-sm text-muted-foreground">
        Matching against the summaries, titles and homepage text of 33,000+ AI startups.
      </p>
    </div>
  )
}
