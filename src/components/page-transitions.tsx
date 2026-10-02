"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Ssgoi } from "@ssgoi/react"
import { drill } from "@ssgoi/react/view-transitions"

// Page transitions only where they explain navigation: going one level deeper,
// from an overview into a niche or a startup profile. Browser Back reverses them.
const MOTION_CONFIG = {
  transitions: [
    { from: ["/", "/niches", "/niche/*", "/scout", "/compare"], to: "/site/*", transition: drill() },
    { from: ["/", "/niches"], to: "/niche/*", transition: drill() },
  ],
}
const NO_MOTION_CONFIG = { transitions: [] }

const reducedMotionQuery = "(prefers-reduced-motion: reduce)"

function subscribe(callback: () => void) {
  const media = window.matchMedia(reducedMotionQuery)
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}

function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  )
}

export function PageTransitions({ children }: { children: React.ReactNode }) {
  const reduceMotion = usePrefersReducedMotion()
  // A manual boundary instead of SsgoiRouteBoundary: the packaged one wraps the page
  // in Suspense, which streams all content hidden and delays the first paint (LCP).
  const pathname = usePathname()

  return (
    <Ssgoi config={reduceMotion ? NO_MOTION_CONFIG : MOTION_CONFIG}>
      <div key={pathname} data-ssgoi-transition={pathname} className="flex flex-1 flex-col">
        {children}
      </div>
    </Ssgoi>
  )
}
