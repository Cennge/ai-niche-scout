// Theme switch that reveals the new theme in a circle growing from the control that
// was used (View Transitions API). Without support, or with reduced motion, it just switches.

import { prefersReducedMotion } from "@/lib/use-reduced-motion"

export type ThemeChoice = "light" | "dark" | "system"

export function switchTheme(
  next: ThemeChoice,
  setTheme: (theme: ThemeChoice) => void,
  origin?: HTMLElement | null,
) {
  const root = document.documentElement
  if (!document.startViewTransition || prefersReducedMotion()) {
    setTheme(next)
    return
  }

  const rect = origin?.getBoundingClientRect()
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
  const y = rect ? rect.top + rect.height / 2 : 0
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  root.style.setProperty("--theme-x", `${x}px`)
  root.style.setProperty("--theme-y", `${y}px`)
  root.style.setProperty("--theme-r", `${radius}px`)
  root.classList.add("theme-transition")

  const transition = document.startViewTransition(() => {
    // Apply the class synchronously so the browser snapshots the new theme;
    // next-themes then persists the choice and keeps the class in sync.
    const dark =
      next === "dark" ||
      (next === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    root.classList.toggle("dark", dark)
    root.classList.toggle("light", !dark)
    root.style.colorScheme = dark ? "dark" : "light"
    setTheme(next)
  })
  transition.finished.finally(() => root.classList.remove("theme-transition"))
}
