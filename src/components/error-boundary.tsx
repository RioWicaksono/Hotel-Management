'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-9 9 9 9 0 019 9m0-5v-1m-4 0a4 4 0 018 4m-8 8v2m0-4h.01" />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-bold text-foreground">Terjadi Kesalahan</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                {this.state.error?.message || 'Silakan refresh halaman ini'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-gradient-to-r from-pink-500 to-violet-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Refresh Halaman
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export function GenericError({ message = 'Terjadi kesalahan' }: { message?: string }) {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-red-500/20 bg-red-50 p-4 dark:bg-red-950/20">
      <div className="text-center">
        <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
      </div>
    </div>
  )
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-2 border-primary/20 border-t-primary ${sizes[size]}`} />
    </div>
  )
}

export function PageLoading() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-muted-foreground">Memuat...</p>
      </div>
    </div>
  )
}
