"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

// A short enter animation when the route changes: opacity and transform only, so it
// runs on the compositor in every browser. The first page load is never animated
// (it would delay the first paint), and reduced-motion users get no animation.
//
// SSGOI page transitions were tried first and dropped: in Firefox the outgoing and
// incoming pages painted out of sync and the motion felt slow.
export function PageTransitions({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [initialPathname] = React.useState(pathname)
  const [navigated, setNavigated] = React.useState(false)

  // Storing "has the route changed since load" from a previous render, per React docs.
  if (!navigated && pathname !== initialPathname) setNavigated(true)

  return (
    <div
      key={pathname}
      className={cn(
        "flex flex-1 flex-col",
        navigated &&
          "animate-in fade-in slide-in-from-bottom-2 duration-200 ease-out motion-reduce:animate-none",
      )}
    >
      {children}
    </div>
  )
}
