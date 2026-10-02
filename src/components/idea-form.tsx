import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

export const EXAMPLE_IDEAS = [
  "AI receptionist",
  "chat with PDF",
  "AI interior design",
  "resume builder",
  "contract review",
  "podcast from blog post",
]

// A plain GET form: works before JavaScript loads and keeps the query in the URL.
export function IdeaForm({ defaultValue, size = "lg" }: { defaultValue?: string; size?: "lg" | "default" }) {
  return (
    <form action="/scout" method="get" role="search" className="flex w-full flex-col gap-2 sm:flex-row">
      <label htmlFor="idea" className="sr-only">
        Describe your AI idea
      </label>
      <InputGroup className={size === "lg" ? "h-12" : undefined}>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          id="idea"
          name="q"
          type="search"
          required
          maxLength={200}
          defaultValue={defaultValue}
          placeholder="e.g. AI receptionist for dental clinics"
          autoComplete="off"
          className={size === "lg" ? "text-base" : undefined}
        />
      </InputGroup>
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
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link href={`/scout?q=${encodeURIComponent(idea)}`}>{idea}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
