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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createBooking } from '@/actions/bookings'
import { createGuest } from '@/actions/guests'
import { Zap, UserPlus } from 'lucide-react'

interface QuickCheckInProps {
  rooms: any[]
}

export function QuickCheckIn({ rooms }: QuickCheckInProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [guestData, setGuestData] = useState({
    name: '',
    phone: '',
  })
  const [bookingData, setBookingData] = useState({
    roomId: '',
    nights: 1,
  })
  const [createdGuestId, setCreatedGuestId] = useState<string | null>(null)

  async function handleAddGuest() {
    if (!guestData.name || !guestData.phone) {
      toast.error('Nama dan telepon wajib diisi')
      return
    }

    setIsLoading(true)
    try {
      const result = await createGuest({
        name: guestData.name,
        phone: guestData.phone,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        setCreatedGuestId(result.guestId ?? null)
        toast.success('Data tamu berhasil disimpan')
        setStep(2)
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCheckIn() {
    if (!bookingData.roomId) {
      toast.error('Pilih kamar')
      return
    }

    setIsLoading(true)
    try {
      const checkIn = new Date()
      const checkOut = new Date()
      checkOut.setDate(checkOut.getDate() + bookingData.nights)

      const room = rooms.find((r: any) => r.id === bookingData.roomId)
      const totalAmount = Number(room?.price || 0) * bookingData.nights

      const result = await createBooking({
        roomId: bookingData.roomId,
        guestId: createdGuestId || '',
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        source: 'DIRECT',
        paymentStatus: 'PAID',
        totalAmount,
        paidAmount: totalAmount,
        notes: 'Quick check-in',
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Check-in berhasil!')
        setIsOpen(false)
        resetForm()
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  function resetForm() {
    setStep(1)
    setGuestData({ name: '', phone: '' })
    setBookingData({ roomId: '', nights: 1 })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-primary/80 text-xs">
          <Zap className="mr-1 h-3 w-3" />
          Quick Check-in
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Check-in
          </DialogTitle>
          <DialogDescription>
            Proses check-in cepat untuk tamu walk-in
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {step === 1 && (
            <>
              <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                <p className="text-sm font-medium flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Data Tamu
                </p>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="guestName">Nama Tamu</Label>
                    <Input
                      id="guestName"
                      value={guestData.name}
                      onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestPhone">No. Telepon</Label>
                    <Input
                      id="guestPhone"
                      value={guestData.phone}
                      onChange={(e) => setGuestData({ ...guestData, phone: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                </div>
              </div>
              <Button onClick={handleAddGuest} disabled={isLoading} className="w-full">
                {isLoading ? 'Menyimpan...' : 'Lanjut ke Pilih Kamar'}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="rounded-lg border bg-emerald-50 border-emerald-200 p-3 dark:bg-emerald-950">
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  <span className="font-semibold">{guestData.name}</span> - {guestData.phone}
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label>Pilih Kamar</Label>
                  <Select
                    value={bookingData.roomId}
                    onValueChange={(value) => setBookingData({ ...bookingData, roomId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kamar tersedia" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room: any) => (
                        <SelectItem key={room.id} value={room.id}>
                          Kamar {room.roomNumber} - {room.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Jumlah Malam</Label>
                  <Select
                    value={bookingData.nights.toString()}
                    onValueChange={(value) => setBookingData({ ...bookingData, nights: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          {n} malam
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Kembali
                </Button>
                <Button onClick={handleCheckIn} disabled={isLoading} className="flex-1">
                  {isLoading ? 'Memproses...' : 'Check-in Sekarang'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
