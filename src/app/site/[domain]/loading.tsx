import { SiteListSkeleton } from "@/components/list-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-10 sm:px-6">
      <span role="status" className="sr-only">
        Loading startup profile…
      </span>
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-md" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-9 w-56" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-full max-w-prose" />
            <Skeleton className="h-5 w-full max-w-prose" />
            <Skeleton className="h-5 w-2/3 max-w-prose" />
          </div>
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
      <SiteListSkeleton rows={3} />
    </div>
  )
}
