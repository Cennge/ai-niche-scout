// Flies a small image from one point to an element along an arc (Web Animations API).
// Used to show where a startup goes when it is added to the compare selection.

import { prefersReducedMotion } from "@/lib/use-reduced-motion"

export function flyTo(src: string, from: DOMRect, targetSelector: string) {
  if (prefersReducedMotion()) return
  // Wait two frames so a target that renders in response to the click exists.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const target = document.querySelector(targetSelector)?.getBoundingClientRect()
      const size = 28
      const startX = from.left + from.width / 2 - size / 2
      const startY = from.top + from.height / 2 - size / 2
      const endX = target ? target.left + target.width / 2 - size / 2 : window.innerWidth / 2
      const endY = target ? target.top + target.height / 2 - size / 2 : window.innerHeight - 40
      const dx = endX - startX
      const dy = endY - startY

      const img = document.createElement("img")
      img.src = src
      img.alt = ""
      img.setAttribute("aria-hidden", "true")
      Object.assign(img.style, {
        position: "fixed",
        left: `${startX}px`,
        top: `${startY}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "6px",
        zIndex: "60",
        pointerEvents: "none",
        boxShadow: "0 6px 20px rgb(0 0 0 / 0.25)",
      })
      document.body.appendChild(img)
      img
        .animate(
          [
            { transform: "translate(0, 0) scale(1)", opacity: 1 },
            {
              transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 90}px) scale(1.15)`,
              opacity: 1,
              offset: 0.45,
            },
            { transform: `translate(${dx}px, ${dy}px) scale(0.7)`, opacity: 0.4 },
          ],
          { duration: 650, easing: "cubic-bezier(0.45, 0, 0.25, 1)" },
        )
        .finished.finally(() => img.remove())
    }),
  )
}
