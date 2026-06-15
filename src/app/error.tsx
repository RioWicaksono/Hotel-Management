'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="relative mx-auto h-20 w-20">
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h2 className="mb-2 text-xl font-bold text-foreground">
          Terjadi Kesalahan
        </h2>
        <p className="mb-2 max-w-md text-sm text-muted-foreground">
          {error.message || 'Terjadi kesalahan yang tidak terduga'}
        </p>
        {error.digest && (
          <p className="mb-6 text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            className="bg-gradient-to-r from-pink-500 to-violet-500 hover:opacity-90"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Coba Lagi
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = '/rooms')}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  )
}
