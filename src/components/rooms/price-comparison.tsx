'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ExternalLink, RefreshCw, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface PriceComparisonProps {
  roomId: string
  roomNumber: string
  currentPrice: number
  weekendPrice?: number | null
}

interface ScrapeResult {
  success: boolean
  hotelName: string
  rooms: Array<{
    name: string
    price: number
  }>
}

export function PriceComparison({ roomId, roomNumber, currentPrice, weekendPrice }: PriceComparisonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScrapeResult | null>(null)
  const [manualPrice, setManualPrice] = useState('')

  async function handleScrape() {
    if (!url.trim()) {
      toast.error('Masukkan URL RedDoorz')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/scrape/reddoorz?url=${encodeURIComponent(url)}`)
      const data = await res.json()
      setResult(data)

      if (data.success && data.rooms.length > 0) {
        toast.success(`Ditemukan ${data.rooms.length} kamar dari ${data.hotelName}`)
      } else {
        toast.info('Tidak ada data harga. Coba input manual.')
      }
    } catch {
      toast.error('Gagal scrape harga')
    } finally {
      setLoading(false)
    }
  }

  async function handleApplyPrice() {
    const price = parseInt(manualPrice)
    if (!price || price <= 0) {
      toast.error('Masukkan harga yang valid')
      return
    }

    try {
      const res = await fetch(`/api/rooms/${roomId}/price`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price, weekendPrice: weekendPrice ? Math.round(price * 1.2) : null }),
      })

      if (res.ok) {
        toast.success('Harga berhasil diupdate')
        setOpen(false)
        router.refresh()
      } else {
        toast.error('Gagal update harga')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <TrendingUp className="h-4 w-4" />
          Bandingkan Harga
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Price Comparison - Kamar {roomNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Price */}
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Harga Saat Ini</p>
            <p className="text-2xl font-bold">{formatCurrency(currentPrice)}/mlm</p>
            {weekendPrice && (
              <p className="text-sm text-amber-500">Weekend: {formatCurrency(weekendPrice)}/mlm</p>
            )}
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <Label>URL RedDoorz (Opsional)</Label>
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.reddoorz.com/..."
              />
              <Button onClick={handleScrape} disabled={loading || !url.trim()}>
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Scraping otomatis mungkin tidak berhasil karena RedDoorz pakai JavaScript
            </p>
          </div>

          {/* Scrape Result */}
          {result && (
            <div className="rounded-lg border p-4">
              <p className="font-medium">{result.hotelName}</p>
              {result.rooms.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {result.rooms.map((room, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{room.name}</span>
                      <span className="font-semibold text-emerald-500">{formatCurrency(room.price)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Tidak ada data harga ditemukan
                </div>
              )}
            </div>
          )}

          {/* Manual Price Input */}
          <div className="space-y-2">
            <Label>Input Manual</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={manualPrice}
                onChange={(e) => setManualPrice(e.target.value)}
                placeholder="150000"
                className="flex-1"
              />
              <Button onClick={handleApplyPrice} disabled={!manualPrice}>
                Apply
              </Button>
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
            <p className="text-xs text-blue-500">
              💡 Tips: Buka website RedDoorz, cari harga kamar yang sejenis, lalu input manual di atas.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
