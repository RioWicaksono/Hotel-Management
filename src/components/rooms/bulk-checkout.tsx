'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { LogOut, CheckCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface BulkCheckoutProps {
  rooms: Array<{
    id: string
    roomNumber: string
    type: string
    price: number | { toString(): string }
    currentBooking?: {
      id: string
      guest: { name: string }
      checkOut: Date
      totalAmount: number | { toString(): string }
    }
  }>
}

export function BulkCheckout({ rooms }: BulkCheckoutProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const occupiedRooms = rooms.filter((r) => r.currentBooking)

  const selectedRooms = occupiedRooms.filter((r) => selected.includes(r.id))
  const totalAmount = selectedRooms.reduce((sum, r) => sum + Number(r.currentBooking?.totalAmount || 0), 0)

  const toggleRoom = (roomId: string) => {
    setSelected((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    )
  }

  const selectAll = () => {
    setSelected(occupiedRooms.map((r) => r.id))
  }

  const clearSelection = () => {
    setSelected([])
  }

  async function handleBulkCheckout() {
    if (selected.length === 0) {
      toast.error('Pilih kamar yang akan check-out')
      return
    }

    setLoading(true)
    try {
      const results = await Promise.all(
        selected.map(async (roomId) => {
          const room = rooms.find((r) => r.id === roomId)
          if (!room?.currentBooking) return { roomId, success: false }

          const res = await fetch(`/api/bookings/${room.currentBooking.id}/checkout`, {
            method: 'POST',
          })
          return { roomId, success: res.ok }
        })
      )

      const successCount = results.filter((r) => r.success).length
      if (successCount > 0) {
        toast.success(`${successCount} kamar berhasil check-out`)
        setOpen(false)
        setSelected([])
        router.refresh()
      } else {
        toast.error('Gagal check-out')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="gap-2"
        disabled={occupiedRooms.length === 0}
      >
        <LogOut className="h-4 w-4" />
        Bulk Check-out ({occupiedRooms.length})
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              Bulk Check-out
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {occupiedRooms.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                Tidak ada kamar yang occupied
              </p>
            ) : (
              <>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    Pilih Semua
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearSelection}>
                    Clear
                  </Button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {occupiedRooms.map((room) => (
                    <label
                      key={room.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selected.includes(room.id)
                          ? 'border-primary bg-primary/10'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <Checkbox
                        checked={selected.includes(room.id)}
                        onCheckedChange={() => toggleRoom(room.id)}
                      />
                      <div className="flex-1">
                        <div className="font-medium">Kamar {room.roomNumber}</div>
                        <div className="text-xs text-muted-foreground">
                          {room.currentBooking?.guest.name}
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(Number(room.currentBooking?.totalAmount) || 0)}
                      </div>
                    </label>
                  ))}
                </div>

                {selected.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {selected.length} kamar dipilih
                      </span>
                      <span className="font-bold">
                        Total: {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleBulkCheckout}
              disabled={loading || selected.length === 0}
              className="bg-emerald-500"
            >
              {loading ? 'Memproses...' : `Check-out ${selected.length} Kamar`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
