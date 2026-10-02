"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Columns3, FileText, Home, LayoutGrid, Monitor, Moon, Search, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { NICHES } from "@/lib/niches"

const PAGES = [
  { href: "/", label: "Home", icon: Home },
  { href: "/niches", label: "All niches", icon: LayoutGrid },
  { href: "/compare", label: "Compare startups", icon: Columns3 },
  { href: "/about", label: "About the data", icon: FileText },
]

function subscribePlatform() {
  return () => {}
}

function useModifierLabel() {
  return React.useSyncExternalStore(
    subscribePlatform,
    () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘" : "Ctrl"),
    () => "Ctrl",
  )
}

export function CommandMenu() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const modifier = useModifierLabel()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing =
        target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "")
      if (
        (event.key === "k" && (event.metaKey || event.ctrlKey)) ||
        (event.key === "/" && !typing)
      ) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const run = (action: () => void) => {
    setOpen(false)
    setQuery("")
    action()
  }

  const trimmed = query.trim()

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="hidden w-48 justify-between text-muted-foreground lg:flex"
      >
        <span className="flex items-center gap-2">
          <Search data-icon="inline-start" />
          Search…
        </span>
        <KbdGroup>
          <Kbd>{modifier}</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="lg:hidden"
        aria-label="Search"
      >
        <Search />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search AI Niche Scout"
        description="Scout an idea, jump to a niche or a page"
      >
        <Command>
          <CommandInput
            placeholder="Scout an idea or jump to a niche…"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>No niche or page matches.</CommandEmpty>
            {trimmed && (
              <CommandGroup heading="Scout" forceMount>
                <CommandItem
                  forceMount
                  value={`scout ${trimmed}`}
                  onSelect={() => run(() => router.push(`/scout?q=${encodeURIComponent(trimmed)}`))}
                >
                  <Search />
                  Scout “{trimmed}”
                </CommandItem>
              </CommandGroup>
            )}
            <CommandGroup heading="Niches">
              {NICHES.map((niche) => (
                <CommandItem
                  key={niche.slug}
                  value={`${niche.name} ${niche.blurb}`}
                  onSelect={() => run(() => router.push(`/niche/${niche.slug}`))}
                >
                  <LayoutGrid />
                  {niche.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Pages">
              {PAGES.map((page) => (
                <CommandItem
                  key={page.href}
                  value={page.label}
                  onSelect={() => run(() => router.push(page.href))}
                >
                  <page.icon />
                  {page.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Theme">
              <CommandItem value="Light theme" onSelect={() => run(() => setTheme("light"))}>
                <Sun />
                Light theme
              </CommandItem>
              <CommandItem value="Dark theme" onSelect={() => run(() => setTheme("dark"))}>
                <Moon />
                Dark theme
              </CommandItem>
              <CommandItem value="System theme" onSelect={() => run(() => setTheme("system"))}>
                <Monitor />
                System theme
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
