'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bed, Users, Calendar, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchResult {
  type: 'room' | 'guest' | 'booking'
  id: string
  title: string
  subtitle: string
  href: string
}

interface GlobalSearchProps {
  className?: string
}

export function GlobalSearch({ className }: GlobalSearchProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.results || [])
        }
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSelect = (result: SearchResult) => {
    router.push(result.href)
    setOpen(false)
    setQuery('')
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'room': return <Bed className="h-4 w-4" />
      case 'guest': return <Users className="h-4 w-4" />
      case 'booking': return <Calendar className="h-4 w-4" />
      default: return <Search className="h-4 w-4" />
    }
  }

  return (
    <>
      {/* Search Trigger */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors',
          className
        )}
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Cari...</span>
        <kbd className="hidden sm:inline text-xs bg-muted px-1.5 py-0.5 rounded border">⌘K</kbd>
      </button>

      {/* Search Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg rounded-xl border bg-background shadow-2xl overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center border-b px-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari kamar, tamu, atau booking..."
                className="flex-1 border-0 bg-transparent px-3 py-4 text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 hover:bg-muted rounded">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {loading && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Mencari...
                </div>
              )}

              {!loading && query && results.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Tidak ditemukan "{query}"
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="space-y-1">
                  {results.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSelect(result)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{result.title}</p>
                        <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                      </div>
                      <span className="text-xs text-muted-foreground capitalize">{result.type}</span>
                    </button>
                  ))}
                </div>
              )}

              {!query && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Ketik untuk mencari kamar, tamu, atau booking
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex gap-4">
                <span><kbd className="px-1 bg-muted rounded">↑↓</kbd> navigasi</span>
                <span><kbd className="px-1 bg-muted rounded">↵</kbd> pilih</span>
                <span><kbd className="px-1 bg-muted rounded">esc</kbd> tutup</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
