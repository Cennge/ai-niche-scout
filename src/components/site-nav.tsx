"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { useCompare } from "@/components/compare-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { compareHref } from "@/lib/compare"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/scout", label: "Scout" },
  { href: "/niches", label: "Niches" },
  { href: "/compare", label: "Compare" },
  { href: "/about", label: "About the data" },
]

function NavLinks({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname()
  const { domains } = useCompare()

  return (
    <ul className={cn("flex gap-1", className)}>
      {LINKS.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
        const isCompare = link.href === "/compare"
        return (
          <li key={link.href}>
            <Button asChild variant="ghost" size="sm" className={cn(active && "bg-muted")}>
              <Link
                href={isCompare ? compareHref(domains) : link.href}
                aria-current={active ? "page" : undefined}
                onClick={onNavigate}
              >
                {link.label}
                {isCompare && domains.length > 0 && (
                  <Badge variant="secondary" aria-label={`${domains.length} selected`}>
                    {domains.length}
                  </Badge>
                )}
              </Link>
            </Button>
          </li>
        )
      })}
    </ul>
  )
}

export function SiteNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <nav aria-label="Main" className="hidden md:block">
        <NavLinks />
      </nav>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav aria-label="Main" className="px-4">
            <NavLinks
              className="flex-col items-stretch [&_a]:w-full [&_a]:justify-start"
              onNavigate={() => setOpen(false)}
            />
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
