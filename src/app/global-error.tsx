'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error)
  }, [error])

  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="mb-2 text-lg font-semibold text-foreground">
          Terjadi Kesalahan
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          {error.message || 'Silakan coba lagi'}
        </p>
        <Button
          onClick={reset}
          size="sm"
          className="bg-gradient-to-r from-pink-500 to-violet-500 hover:opacity-90"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  )
}
