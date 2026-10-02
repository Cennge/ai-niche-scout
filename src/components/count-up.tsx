"use client"

import * as React from "react"

import { formatNumber } from "@/lib/format"
import { prefersReducedMotion } from "@/lib/use-reduced-motion"

// Counts from 0 to `value` once on mount, easing out. The server renders the final
// number, so the value is correct without JavaScript and for screen readers.
export function CountUp({ value, duration = 900 }: { value: number; duration?: number }) {
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useLayoutEffect(() => {
    const node = ref.current
    if (!node || prefersReducedMotion() || value < 10) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      node.textContent = formatNumber(Math.round(value * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    node.textContent = "0"
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      node.textContent = formatNumber(value)
    }
  }, [value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {formatNumber(value)}
    </span>
  )
}
