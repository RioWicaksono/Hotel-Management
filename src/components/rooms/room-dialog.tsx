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
import { createRoom, updateRoom, deleteRoom } from '@/actions/rooms'
import { RoomDialogProps } from './types'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'

export function RoomDialog({ mode, room, children }: RoomDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    roomNumber: room?.roomNumber || '',
    type: room?.type || 'Standard',
    price: room?.price?.toString() || '',
    weekendPrice: room?.weekendPrice?.toString() || '',
    status: room?.status || 'AVAILABLE',
    description: room?.description || '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result =
        mode === 'create'
          ? await createRoom({
              roomNumber: formData.roomNumber,
              type: formData.type,
              price: parseFloat(formData.price),
              weekendPrice: formData.weekendPrice ? parseFloat(formData.weekendPrice) : null,
              status: formData.status,
              description: formData.description,
            })
          : await updateRoom(room!.id, {
              roomNumber: formData.roomNumber,
              type: formData.type,
              price: parseFloat(formData.price),
              weekendPrice: formData.weekendPrice ? parseFloat(formData.weekendPrice) : null,
              status: formData.status,
              description: formData.description,
            })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(mode === 'create' ? 'Kamar berhasil ditambahkan' : 'Kamar berhasil diperbarui')
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
    if (!room) return
    if (!confirm('Yakin ingin menghapus kamar ini?')) return

    setIsLoading(true)
    try {
      const result = await deleteRoom(room.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Kamar berhasil dihapus')
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
          <div>{children}</div>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kamar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Tambah Kamar Baru' : 'Edit Kamar'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create'
                ? 'Tambahkan kamar baru ke sistem'
                : 'Perbarui informasi kamar'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="roomNumber">Nomor Kamar</Label>
              <Input
                id="roomNumber"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                placeholder="101"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Tipe Kamar</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="Standard"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Harga per Malam (IDR)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="150000"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weekendPrice" className="flex items-center gap-1">
                Harga Weekend
                <Star className="h-3 w-3 text-amber-500" />
              </Label>
              <Input
                id="weekendPrice"
                type="number"
                value={formData.weekendPrice}
                onChange={(e) => setFormData({ ...formData, weekendPrice: e.target.value })}
                placeholder="175000 (opsional)"
              />
              <p className="text-xs text-muted-foreground">Untuk Jumat-Minggu & hari libur</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Tersedia</SelectItem>
                  <SelectItem value="OCCUPIED">Terisi</SelectItem>
                  <SelectItem value="CLEANING">Dibersihkan</SelectItem>
                  <SelectItem value="MAINTENANCE">Perbaikan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi (Opsional)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="AC, TV, Kamar mandi dalam"
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
                Hapus Kamar
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
