"use client"

import * as React from "react"

import { prefersReducedMotion } from "@/lib/use-reduced-motion"

// Marks its subtree with data-reveal="pending" until it first scrolls into view, then
// "visible". CSS decides what that animates. Without JavaScript nothing is hidden, and
// content already on screen when the page loads is left alone.
export function RevealOnView({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const node = ref.current
    if (!node || prefersReducedMotion() || !("IntersectionObserver" in window)) return
    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.85) return

    node.dataset.reveal = "pending"
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        node.dataset.reveal = "visible"
        observer.disconnect()
      },
      { threshold: 0.2 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
