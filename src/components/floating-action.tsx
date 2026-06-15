'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createBooking } from '@/actions/bookings'
import { createGuest } from '@/actions/guests'
import { Plus, CalendarCheck } from 'lucide-react'

interface FloatingActionProps {
  rooms: any[]
  guests: any[]
}

export function FloatingAction({ rooms, guests }: FloatingActionProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'menu' | 'guest' | 'booking'>('menu')
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [selectedGuest, setSelectedGuest] = useState('')
  const [selectedRoom, setSelectedRoom] = useState('')
  const [nights, setNights] = useState(1)
  const [loading, setLoading] = useState(false)

  const availableRooms = rooms.filter((r: any) => r.status === 'AVAILABLE')

  function resetForm() {
    setStep('menu')
    setGuestName('')
    setGuestPhone('')
    setSelectedGuest('')
    setSelectedRoom('')
    setNights(1)
  }

  function close() {
    setOpen(false)
    setTimeout(resetForm, 200)
  }

  async function handleAddGuest() {
    if (!guestName || !guestPhone) {
      toast.error('Nama dan telepon wajib diisi')
      return
    }
    setLoading(true)
    try {
      const result = await createGuest({ name: guestName, phone: guestPhone })
      if (result.error) {
        toast.error(result.error)
      } else {
        setSelectedGuest(result.guestId ?? '')
        setStep('booking')
        toast.success('Tamu berhasil ditambahkan')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  async function handleBooking() {
    if (!selectedRoom || !selectedGuest) {
      toast.error('Pilih kamar dan tamu')
      return
    }
    setLoading(true)
    try {
      const checkIn = new Date()
      const checkOut = new Date(checkIn)
      checkOut.setDate(checkOut.getDate() + nights)
      const room = rooms.find((r: any) => r.id === selectedRoom)
      const total = Number(room?.price || 0) * nights
      const result = await createBooking({
        roomId: selectedRoom,
        guestId: selectedGuest,
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        source: 'DIRECT',
        paymentStatus: 'PAID',
        totalAmount: total,
        paidAmount: total,
        notes: 'Booking dari FAB',
      })
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Booking berhasil')
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
    <div>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-white shadow-xl hover:scale-110 transition-all duration-200 lg:hidden"
      >
        <Plus className="h-6 w-6" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => setStep('guest')} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Tamu Baru
              </Button>
              <Button onClick={() => setStep('booking')} variant="outline">
                <CalendarCheck className="h-4 w-4 mr-2" />
                Booking Baru
              </Button>
            </div>
            {step === 'guest' && (
              <div className="space-y-3">
                <div>
                  <Label>Nama Tamu</Label>
                  <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Nama lengkap" autoFocus />
                </div>
                <div>
                  <Label>No. Telepon</Label>
                  <Input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="08xxxxxxxxxx" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('menu')} className="flex-1">
                    Batal
                  </Button>
                  <Button onClick={handleAddGuest} disabled={loading} className="flex-1 bg-pink-500">
                    {loading ? 'Menyimpan...' : 'Lanjut'}
                  </Button>
                </div>
              </div>
            )}
            {step === 'booking' && (
              <div className="space-y-3">
                <div>
                  <Label>Pilih Tamu</Label>
                  <Select value={selectedGuest} onValueChange={setSelectedGuest}>
                    <SelectTrigger><SelectValue placeholder="Pilih tamu" /></SelectTrigger>
                    <SelectContent>
                      {guests.slice(0, 20).map((g: any) => (
                        <SelectItem key={g.id} value={g.id}>{g.name} - {g.phone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Pilih Kamar</Label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger><SelectValue placeholder="Pilih kamar" /></SelectTrigger>
                    <SelectContent>
                      {availableRooms.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Semua kamar penuh</div>
                      ) : (
                        availableRooms.map((r: any) => (
                          <SelectItem key={r.id} value={r.id}>Kamar {r.roomNumber} - {r.type}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Lama Menginap</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Button key={n} variant={nights === n ? 'default' : 'outline'} onClick={() => setNights(n)} className="flex-1">{n} mlm</Button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('menu')} className="flex-1">
                    Batal
                  </Button>
                  <Button
                    onClick={handleBooking}
                    disabled={loading || !selectedRoom || !selectedGuest}
                    className="flex-1 bg-emerald-500"
                  >
                    {loading ? 'Memproses...' : 'Booking Sekarang'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
