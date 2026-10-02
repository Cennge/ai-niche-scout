"use client"

import * as React from "react"

// Shares one transition between the filter controls and the results they change,
// so the old results dim while the new ones load instead of looking current.

type ResultsTransition = {
  pending: boolean
  startTransition: React.TransitionStartFunction
}

const Context = React.createContext<ResultsTransition | null>(null)

export function ResultsTransitionProvider({ children }: { children: React.ReactNode }) {
  const [pending, startTransition] = React.useTransition()
  const value = React.useMemo(() => ({ pending, startTransition }), [pending])
  return <Context value={value}>{children}</Context>
}

/** The shared transition, or a local one when used outside a provider. */
export function useResultsTransition(): ResultsTransition {
  const shared = React.use(Context)
  const [pending, startTransition] = React.useTransition()
  return shared ?? { pending, startTransition }
}

export function ResultsRegion({ children }: { children: React.ReactNode }) {
  const { pending } = useResultsTransition()
  return (
    <div
      aria-busy={pending}
      className="flex flex-col gap-4 transition-opacity duration-200 data-[pending=true]:pointer-events-none data-[pending=true]:opacity-45 motion-reduce:transition-none"
      data-pending={pending}
    >
      {children}
    </div>
  )
}
