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
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Zap, UserPlus, CalendarCheck, Star } from 'lucide-react'
import { createBooking } from '@/actions/bookings'
import { createGuest } from '@/actions/guests'
import { formatCurrency } from '@/lib/utils'

interface WalkInCheckInProps {
  rooms: Array<{
    id: string
    roomNumber: string
    type: string
    price: number | { toString(): string }
    weekendPrice?: number | null | { toString(): string }
    status: string
  }>
  loyalGuests?: Array<{
    id: string
    name: string
    phone: string
    visitCount: number
  }>
}

export function WalkInCheckIn({ rooms, loyalGuests = [] }: WalkInCheckInProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'guest' | 'room'>('guest')
  const [loading, setLoading] = useState(false)
  const [guestData, setGuestData] = useState({
    name: '',
    phone: '',
    isLoyal: false,
  })
  const [selectedGuestId, setSelectedGuestId] = useState<string>('')
  const [selectedRoom, setSelectedRoom] = useState('')
  const [nights, setNights] = useState(1)

  const availableRooms = rooms.filter((r) => r.status === 'AVAILABLE')
  const isWeekend = [0, 6].includes(new Date().getDay())

  function resetForm() {
    setStep('guest')
    setGuestData({ name: '', phone: '', isLoyal: false })
    setSelectedGuestId('')
    setSelectedRoom('')
    setNights(1)
  }

  function close() {
    setOpen(false)
    setTimeout(resetForm, 200)
  }

  async function handleSubmit() {
    if (!selectedRoom) {
      toast.error('Pilih kamar')
      return
    }

    const guestId = selectedGuestId || guestData.name
    if (!guestId) {
      toast.error('Pilih atau tambah tamu')
      return
    }

    setLoading(true)
    try {
      let finalGuestId = selectedGuestId

      // Create guest if new
      if (!selectedGuestId && guestData.name && guestData.phone) {
        const guestResult = await createGuest({
          name: guestData.name,
          phone: guestData.phone,
        })
        if (guestResult.error) {
          toast.error(guestResult.error)
          return
        }
        finalGuestId = guestResult.guestId ?? ''
      }

      const room = rooms.find((r) => r.id === selectedRoom)
      const price = isWeekend && room?.weekendPrice ? Number(room.weekendPrice) : Number(room?.price)
      const total = price * nights

      const checkIn = new Date()
      const checkOut = new Date(checkIn)
      checkOut.setDate(checkOut.getDate() + nights)

      const result = await createBooking({
        roomId: selectedRoom,
        guestId: finalGuestId,
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        source: 'WALK_IN',
        paymentStatus: 'PAID',
        totalAmount: total,
        paidAmount: total,
        notes: 'Walk-in',
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Check-in berhasil!')
        close()
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500">
        <Zap className="h-4 w-4" />
        Walk-in Check-in
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Walk-in Check-in
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Step 1: Guest Selection */}
            {step === 'guest' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Pilih Tamu Langganan</Label>
                  <Select value={selectedGuestId} onValueChange={setSelectedGuestId}>
                    <SelectTrigger>
                      <SelectValue placeholder="-- Tamu Baru --" />
                    </SelectTrigger>
                    <SelectContent>
                      {loyalGuests.map((g) => (
                        <SelectItem key={g.id} value={g.id}>
                          <div className="flex items-center gap-2">
                            <Star className="h-3 w-3 text-amber-500" />
                            {g.name} ({g.visitCount}x)
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">atau</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Nama Tamu Baru</Label>
                    <Input
                      value={guestData.name}
                      onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                      placeholder="Nama lengkap"
                      disabled={!!selectedGuestId}
                    />
                  </div>
                  <div>
                    <Label>Telepon</Label>
                    <Input
                      value={guestData.phone}
                      onChange={(e) => setGuestData({ ...guestData, phone: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      disabled={!!selectedGuestId}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setStep('room')}
                  disabled={(!selectedGuestId && (!guestData.name || !guestData.phone))}
                  className="w-full"
                >
                  Lanjut Pilih Kamar
                </Button>
              </div>
            )}

            {/* Step 2: Room Selection */}
            {step === 'room' && (
              <div className="space-y-4">
                <div>
                  <Label>Pilih Kamar</Label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kamar" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          Semua kamar penuh
                        </div>
                      ) : (
                        availableRooms.map((r) => {
                          const price = isWeekend && r.weekendPrice ? Number(r.weekendPrice) : Number(r.price)
                          return (
                            <SelectItem key={r.id} value={r.id}>
                              Kamar {r.roomNumber} - {r.type} ({formatCurrency(price)}/mlm)
                              {isWeekend && r.weekendPrice && (
                                <span className="text-amber-500 ml-1">(Weekend)</span>
                              )}
                            </SelectItem>
                          )
                        })
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Lama Menginap</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Button
                        key={n}
                        type="button"
                        variant={nights === n ? 'default' : 'outline'}
                        onClick={() => setNights(n)}
                        className="flex-1"
                      >
                        {n} mlm
                      </Button>
                    ))}
                  </div>
                </div>

                {selectedRoom && (
                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total:</span>
                      <span className="text-lg font-bold">
                        {formatCurrency(
                          (isWeekend && rooms.find(r => r.id === selectedRoom)?.weekendPrice
                            ? Number(rooms.find(r => r.id === selectedRoom)?.weekendPrice)
                            : Number(rooms.find(r => r.id === selectedRoom)?.price)) * nights
                        )}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('guest')} className="flex-1">
                    Kembali
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading || !selectedRoom}
                    className="flex-1 bg-emerald-500"
                  >
                    {loading ? 'Memproses...' : 'Check-in Sekarang'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
