"use client"

import * as React from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { switchTheme, type ThemeChoice } from "@/lib/theme-switch"

export function ModeToggle() {
  const { setTheme } = useTheme()
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const choose = (theme: ThemeChoice) => switchTheme(theme, setTheme, triggerRef.current)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button ref={triggerRef} variant="outline" size="icon" aria-label="Toggle theme">
          <Sun className="scale-100 rotate-0 transition-transform motion-reduce:transition-none dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute scale-0 rotate-90 transition-transform motion-reduce:transition-none dark:scale-100 dark:rotate-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => choose("light")}>
            <Sun />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => choose("dark")}>
            <Moon />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => choose("system")}>
            <Monitor />
            System
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
