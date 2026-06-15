'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createGuest, updateGuest, deleteGuest, toggleLoyalGuest } from '@/actions/guests'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'

interface GuestDialogProps {
  mode?: 'create' | 'edit'
  guest?: {
    id: string
    name: string
    email: string | null
    phone: string
    address: string | null
    idCard: string | null
    notes: string | null
    isLoyal: boolean
  }
  children?: React.ReactNode
}

export function GuestDialog({ mode = 'create', guest, children }: GuestDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: guest?.name || '',
    email: guest?.email || '',
    phone: guest?.phone || '',
    address: guest?.address || '',
    idCard: guest?.idCard || '',
    notes: guest?.notes || '',
    isLoyal: guest?.isLoyal || false,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result =
        mode === 'create'
          ? await createGuest({
              name: formData.name,
              email: formData.email || undefined,
              phone: formData.phone,
              address: formData.address || undefined,
              idCard: formData.idCard || undefined,
              notes: formData.notes || undefined,
              isLoyal: formData.isLoyal,
            })
          : await updateGuest(guest!.id, {
              name: formData.name,
              email: formData.email || undefined,
              phone: formData.phone,
              address: formData.address || undefined,
              idCard: formData.idCard || undefined,
              notes: formData.notes || undefined,
              isLoyal: formData.isLoyal,
            })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(mode === 'create' ? 'Tamu berhasil ditambahkan' : 'Tamu berhasil diperbarui')
        setIsOpen(false)
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleLoyal() {
    if (!guest) return
    setIsLoading(true)
    try {
      const result = await toggleLoyalGuest(guest.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(guest.isLoyal ? 'Tamu dihapus dari langganan' : 'Tamu ditandai sebagai langganan')
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!guest) return
    if (!confirm('Yakin ingin menghapus tamu ini?')) return

    setIsLoading(true)
    try {
      const result = await deleteGuest(guest.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Tamu berhasil dihapus')
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
            Tambah Tamu
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Tambah Tamu Baru' : 'Edit Tamu'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create' ? 'Tambahkan data tamu baru' : 'Perbarui data tamu'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="081234567890"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email (Opsional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Alamat (Opsional)</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Jl. Jalan No. 1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="idCard">No. KTP (Opsional)</Label>
              <Input
                id="idCard"
                value={formData.idCard}
                onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                placeholder="1234567890123456"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Catatan (Opsional)</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Catatan tambahan"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isLoyal"
                checked={formData.isLoyal}
                onCheckedChange={(checked) => setFormData({ ...formData, isLoyal: !!checked })}
              />
              <Label htmlFor="isLoyal" className="flex items-center gap-1 cursor-pointer">
                <Star className="h-4 w-4 text-amber-500" />
                Tandai sebagai Tamu Langganan
              </Label>
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Memproses...' : mode === 'create' ? 'Tambah' : 'Simpan'}
            </Button>
            {mode === 'edit' && guest && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleToggleLoyal}
                  disabled={isLoading}
                  className="flex-1 gap-1"
                >
                  <Star className={`h-4 w-4 ${guest.isLoyal ? 'text-amber-500 fill-amber-500' : ''}`} />
                  {guest.isLoyal ? 'Hapus Langganan' : 'Jadikan Langganan'}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </Button>
              </div>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
