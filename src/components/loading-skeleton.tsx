import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function RoomCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted" />
            <div>
              <div className="h-4 w-16 rounded bg-muted" />
              <div className="mt-1 h-3 w-12 rounded bg-muted" />
            </div>
          </div>
          <div className="h-6 w-16 rounded-full bg-muted" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        <div className="h-12 rounded-lg bg-muted" />
        <div className="flex gap-1">
          <div className="h-8 flex-1 rounded-lg bg-muted" />
          <div className="h-8 flex-1 rounded-lg bg-muted" />
          <div className="h-8 flex-1 rounded-lg bg-muted" />
        </div>
        <div className="h-8 rounded-lg bg-muted" />
      </CardContent>
    </Card>
  )
}

export function BookingCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted" />
            <div>
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="mt-1 h-3 w-16 rounded bg-muted" />
            </div>
          </div>
          <div className="h-6 w-16 rounded-full bg-muted" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="flex justify-between">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-4 w-20 rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  )
}

export function GuestCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="h-12 w-12 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-3 w-24 rounded bg-muted" />
        </div>
        <div className="h-8 w-8 rounded bg-muted" />
      </CardContent>
    </Card>
  )
}

export function StatsCardSkeleton() {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-muted" />
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-muted" />
          <div className="h-5 w-12 rounded bg-muted" />
        </div>
      </div>
    </Card>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 border-b pb-2">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 flex-1 rounded bg-muted" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-2">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 flex-1 rounded bg-muted" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CalendarSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 rounded-lg bg-muted" />
        <div className="flex gap-2">
          <div className="h-8 w-8 rounded-lg bg-muted" />
          <div className="h-8 w-8 rounded-lg bg-muted" />
        </div>
      </div>
      {/* Grid */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={`header-${i}`} className="h-8 rounded bg-muted" />
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={`day-${i}`} className="aspect-square rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  )
}
