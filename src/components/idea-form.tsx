"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutGrid, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { NICHES, type Niche } from "@/lib/niches"
import { cn } from "@/lib/utils"

export const EXAMPLE_IDEAS = [
  "AI receptionist",
  "chat with PDF",
  "AI interior design",
  "resume builder",
  "contract review",
  "podcast from blog post",
]

const STOP_WORDS = new Set(["ai", "for", "and", "the", "with", "app", "tool", "from"])

// Niches whose name or description shares a meaningful word with the idea.
function suggestNiches(value: string): Niche[] {
  const words = value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w))
  if (!words.length) return []
  return NICHES.map((niche) => {
    const name = niche.name.toLowerCase()
    const text = `${name} ${niche.blurb.toLowerCase()}`
    const score = words.reduce(
      (sum, w) => sum + (name.includes(w) ? 3 : 0) + (text.includes(w.slice(0, 5)) ? 1 : 0),
      0,
    )
    return { niche, score }
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((s) => s.niche)
}

// A plain GET form that works before JavaScript loads; with JS it also suggests niches.
export function IdeaForm({
  defaultValue,
  size = "lg",
}: {
  defaultValue?: string
  size?: "lg" | "default"
}) {
  const router = useRouter()
  const listId = React.useId()
  const [value, setValue] = React.useState(defaultValue ?? "")
  const [open, setOpen] = React.useState(false)
  const [active, setActive] = React.useState(-1)
  const suggestions = React.useMemo(() => suggestNiches(value), [value])
  const expanded = open && suggestions.length > 0

  const go = (niche: Niche) => {
    setOpen(false)
    router.push(`/niche/${niche.slug}`)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!expanded) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActive((i) => (i + 1) % suggestions.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (event.key === "Escape") {
      setOpen(false)
      setActive(-1)
    } else if (event.key === "Enter" && active >= 0) {
      event.preventDefault()
      go(suggestions[active])
    }
  }

  return (
    <form
      action="/scout"
      method="get"
      role="search"
      className="flex w-full flex-col gap-2 sm:flex-row"
    >
      <div className="relative flex-1">
        <label htmlFor="idea" className="sr-only">
          Describe your AI idea
        </label>
        <InputGroup className={cn("bg-background", size === "lg" && "h-12")}>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            id="idea"
            name="q"
            type="search"
            required
            maxLength={200}
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              setOpen(true)
              setActive(-1)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onKeyDown={onKeyDown}
            placeholder="e.g. AI receptionist for dental clinics…"
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={expanded}
            aria-controls={listId}
            aria-activedescendant={expanded && active >= 0 ? `${listId}-${active}` : undefined}
            className={size === "lg" ? "text-base" : undefined}
          />
        </InputGroup>
        <div
          className={cn(
            "absolute inset-x-0 top-full z-30 mt-1 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-md",
            !expanded && "hidden",
          )}
        >
          <p className="px-3 pt-2 pb-1 text-xs text-muted-foreground">Jump to a niche</p>
          <ul id={listId} role="listbox" aria-label="Matching niches" className="pb-1">
            {suggestions.map((niche, i) => (
              <li
                key={niche.slug}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                // Keep focus in the input, so blur does not close the list before the click lands.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => go(niche)}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
                  i === active && "bg-accent text-accent-foreground",
                )}
              >
                <LayoutGrid className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="truncate">{niche.name}</span>
              </li>
            ))}
          </ul>
          <p className="border-t px-3 py-2 text-xs text-muted-foreground">
            {active >= 0
              ? `Press Enter to open ${suggestions[active]?.name}`
              : `Press Enter to scout “${value.trim()}” as an idea`}
          </p>
        </div>
      </div>
      <Button type="submit" size={size} className={size === "lg" ? "h-12 px-6" : undefined}>
        Scout idea
      </Button>
    </form>
  )
}

export function ExampleIdeas() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-muted-foreground">Try</span>
      <ul className="flex flex-wrap gap-2">
        {EXAMPLE_IDEAS.map((idea) => (
          <li key={idea}>
            <Button asChild variant="outline" size="sm" className="rounded-full bg-background">
              <Link href={`/scout?q=${encodeURIComponent(idea)}`}>{idea}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
