import Link from "next/link"
import { MapPinOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-16 sm:px-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MapPinOff />
          </EmptyMedia>
          <EmptyTitle>
            <h1>This page is not on the map</h1>
          </EmptyTitle>
          <EmptyDescription>
            The startup or niche you are looking for is not in the FreeSerp AI index.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/">Scout an idea</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
