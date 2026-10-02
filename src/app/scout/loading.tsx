import { Suspense } from "react"

import { SiteListSkeleton } from "@/components/list-skeleton"
import { ScanStatus } from "@/components/scan-status"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-10 w-72 max-w-full" />
      </div>
      <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
        <ScanStatus />
      </Suspense>
      <SiteListSkeleton rows={3} />
    </div>
  )
}
