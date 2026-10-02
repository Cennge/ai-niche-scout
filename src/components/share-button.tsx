"use client"

import { Share2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

// Uses the native share sheet where it exists (mobile), otherwise copies the link.
export function ShareButton({ title }: { title: string }) {
  const onClick = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch (error) {
        if ((error as Error).name === "AbortError") return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied", { description: "Anyone with the link sees this verdict." })
    } catch {
      toast.error("Could not copy the link", { description: "Copy it from the address bar instead." })
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      <Share2 data-icon="inline-start" />
      Share verdict
    </Button>
  )
}
