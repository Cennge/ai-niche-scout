"use client"

import { Check, Plus } from "lucide-react"

import { useCompare } from "@/components/compare-store"
import { Button } from "@/components/ui/button"

export function CompareToggle({ domain }: { domain: string }) {
  const { has, toggle } = useCompare()
  const selected = has(domain)

  return (
    <Button
      type="button"
      variant={selected ? "secondary" : "outline"}
      size="sm"
      aria-pressed={selected}
      onClick={() => toggle(domain)}
    >
      {selected ? <Check data-icon="inline-start" /> : <Plus data-icon="inline-start" />}
      {selected ? "Comparing" : "Compare"}
    </Button>
  )
}
