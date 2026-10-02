import { Skeleton } from "@/components/ui/skeleton"

export function SiteListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <ul className="divide-y border-y" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex gap-4 py-5">
          <Skeleton className="size-8 shrink-0 rounded-md" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3.5 w-64 max-w-full" />
            <Skeleton className="h-3.5 w-full max-w-prose" />
            <Skeleton className="h-3.5 w-3/4 max-w-prose" />
          </div>
          <div className="hidden w-44 flex-col items-end gap-2 sm:flex">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-8 w-24" />
          </div>
        </li>
      ))}
    </ul>
  )
}
