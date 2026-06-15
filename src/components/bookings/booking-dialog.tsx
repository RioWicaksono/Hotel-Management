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
  DialogFooter,
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
import { createBooking, updateBooking, deleteBooking } from '@/actions/bookings'
import { createGuest } from '@/actions/guests'
import { Plus, Pencil, Trash2, UserPlus, Users } from 'lucide-react'

interface BookingDialogProps {
  mode?: 'create' | 'edit'
  booking?: any
  rooms: any[]
  guests: any[]
  children?: React.ReactNode
  className?: string
}

export function BookingDialog({ mode = 'create', booking, rooms, guests, children, className }: BookingDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showGuestForm, setShowGuestForm] = useState(false)
  const [newGuest, setNewGuest] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  })
  const [formData, setFormData] = useState({
    roomId: booking?.roomId || '',
    guestId: booking?.guestId || '',
    checkIn: booking?.checkIn?.split('T')[0] || '',
    checkOut: booking?.checkOut?.split('T')[0] || '',
    source: booking?.source || 'DIRECT',
    paymentStatus: booking?.paymentStatus || 'UNPAID',
    totalAmount: booking?.totalAmount?.toString() || '',
    paidAmount: booking?.paidAmount?.toString() || '0',
    notes: booking?.notes || '',
  })

  async function handleAddGuest() {
    if (!newGuest.name || !newGuest.phone) {
      toast.error('Nama dan telepon wajib diisi')
      return
    }

    setIsLoading(true)
    try {
      const result = await createGuest({
        name: newGuest.name,
        phone: newGuest.phone,
        email: newGuest.email || undefined,
        address: newGuest.address || undefined,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Tamu baru berhasil ditambahkan')
        setShowGuestForm(false)
        setNewGuest({ name: '', phone: '', email: '', address: '' })
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result =
        mode === 'create'
          ? await createBooking({
              roomId: formData.roomId,
              guestId: formData.guestId,
              checkIn: formData.checkIn,
              checkOut: formData.checkOut,
              source: formData.source,
              paymentStatus: formData.paymentStatus,
              totalAmount: parseFloat(formData.totalAmount),
              paidAmount: parseFloat(formData.paidAmount),
              notes: formData.notes,
            })
          : await updateBooking(booking!.id, {
              roomId: formData.roomId,
              guestId: formData.guestId,
              checkIn: formData.checkIn,
              checkOut: formData.checkOut,
              source: formData.source,
              paymentStatus: formData.paymentStatus,
              totalAmount: parseFloat(formData.totalAmount),
              paidAmount: parseFloat(formData.paidAmount),
              notes: formData.notes,
            })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(mode === 'create' ? 'Booking berhasil ditambahkan' : 'Booking berhasil diperbarui')
        setIsOpen(false)
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!booking) return
    if (!confirm('Yakin ingin menghapus booking ini?')) return

    setIsLoading(true)
    try {
      const result = await deleteBooking(booking.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Booking berhasil dihapus')
        setIsOpen(false)
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ? (
          <div className={className}>{children}</div>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Booking
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Tambah Booking Baru' : 'Detail Booking'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create' ? 'Tambahkan booking baru' : 'Informasi booking'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="roomId">Kamar</Label>
              <Select
                value={formData.roomId}
                onValueChange={(value) => setFormData({ ...formData, roomId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kamar" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      Kamar {room.roomNumber} - {room.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Guest Selection with Add New */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="guestId">Tamu</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGuestForm(!showGuestForm)}
                  className="text-primary h-auto p-0 text-xs"
                >
                  <UserPlus className="mr-1 h-3 w-3" />
                  {showGuestForm ? 'Batal' : 'Tambah Tamu Baru'}
                </Button>
              </div>

              {showGuestForm ? (
                <div className="rounded-lg border bg-muted/50 p-3 space-y-3">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Input Tamu Baru
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Nama lengkap"
                      value={newGuest.name}
                      onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                    />
                    <Input
                      placeholder="No. Telepon"
                      value={newGuest.phone}
                      onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Email (opsional)"
                      value={newGuest.email}
                      onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                    />
                    <Input
                      placeholder="Alamat (opsional)"
                      value={newGuest.address}
                      onChange={(e) => setNewGuest({ ...newGuest, address: e.target.value })}
                    />
                  </div>
                  <Button type="button" size="sm" onClick={handleAddGuest} disabled={isLoading}>
                    <Plus className="mr-1 h-3 w-3" />
                    {isLoading ? 'Menyimpan...' : 'Simpan Tamu'}
                  </Button>
                </div>
              ) : (
                <Select
                  value={formData.guestId}
                  onValueChange={(value) => setFormData({ ...formData, guestId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tamu" />
                  </SelectTrigger>
                  <SelectContent>
                    {guests.map((guest) => (
                      <SelectItem key={guest.id} value={guest.id}>
                        {guest.name} - {guest.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="checkIn">Check-in</Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="checkOut">Check-out</Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="source">Sumber</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => setFormData({ ...formData, source: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih sumber" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DIRECT">Langsung</SelectItem>
                    <SelectItem value="REDDOORZ">RedDoorz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentStatus">Status Bayar</Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(value) => setFormData({ ...formData, paymentStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNPAID">Belum Bayar</SelectItem>
                    <SelectItem value="DP">DP</SelectItem>
                    <SelectItem value="PAID">Lunas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="totalAmount">Total (IDR)</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paidAmount">Sudah Bayar (IDR)</Label>
                <Input
                  id="paidAmount"
                  type="number"
                  value={formData.paidAmount}
                  onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Catatan</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Catatan tambahan"
              />
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Memproses...' : mode === 'create' ? 'Tambah' : 'Simpan'}
            </Button>
            {mode === 'edit' && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Booking
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
