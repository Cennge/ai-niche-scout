"use client"

import { useRouter } from "next/navigation"
import { Check, Plus } from "lucide-react"
import { toast } from "sonner"

import { useCompare } from "@/components/compare-store"
import { Button } from "@/components/ui/button"
import { compareHref, MAX_COMPARE } from "@/lib/compare"

export function CompareToggle({ domain }: { domain: string }) {
  const router = useRouter()
  const { domains, has, toggle } = useCompare()
  const selected = has(domain)

  const onClick = () => {
    toggle(domain)
    if (selected) {
      toast(`Removed ${domain} from compare`)
      return
    }
    const next = [...domains, domain].slice(-MAX_COMPARE)
    const dropped = domains.length >= MAX_COMPARE ? domains[0] : null
    toast.success(`Added ${domain} to compare`, {
      description: dropped
        ? `You can compare up to ${MAX_COMPARE}, so ${dropped} was taken out.`
        : `${next.length} of ${MAX_COMPARE} selected.`,
      action: { label: "Compare", onClick: () => router.push(compareHref(next)) },
    })
  }

  return (
    <Button
      type="button"
      variant={selected ? "secondary" : "outline"}
      size="sm"
      aria-pressed={selected}
      onClick={onClick}
    >
      {selected ? <Check data-icon="inline-start" /> : <Plus data-icon="inline-start" />}
      {selected ? "Comparing" : "Compare"}
    </Button>
  )
}
