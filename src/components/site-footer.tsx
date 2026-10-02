import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          Data from the{" "}
          <a href="https://freeserp.ai" className="underline underline-offset-4 hover:text-foreground">
            FreeSerp
          </a>{" "}
          sites index. Counts refresh daily.
        </p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-foreground">
            About the data
          </Link>
          <a href="https://github.com/Cennge/ai-niche-scout" className="hover:text-foreground">
            Source on GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
