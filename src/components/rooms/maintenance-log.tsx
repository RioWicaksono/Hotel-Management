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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wrench, Plus, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface MaintenanceLogProps {
  roomId: string
  roomNumber: string
  maintenance: Array<{
    id: string
    type: string
    description: string
    cost: number | null | { toString(): string }
    status: string
    date: Date
  }>
}

const MAINTENANCE_TYPES = [
  { value: 'CLEANING', label: 'Pembersihan' },
  { value: 'REPAIR', label: 'Perbaikan' },
  { value: 'RENOVATION', label: 'Renovasi' },
  { value: 'REPLACEMENT', label: 'Penggantian' },
  { value: 'INSPECTION', label: 'Inspeksi' },
  { value: 'OTHER', label: 'Lainnya' },
]

export function MaintenanceLog({ roomId, roomNumber, maintenance }: MaintenanceLogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    cost: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.type || !formData.description) {
      toast.error('Lengkapi semua field')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          type: formData.type,
          description: formData.description,
          cost: formData.cost ? parseFloat(formData.cost) : null,
        }),
      })

      if (res.ok) {
        toast.success('Maintenance berhasil dicatat')
        setOpen(false)
        setFormData({ type: '', description: '', cost: '' })
        router.refresh()
      } else {
        toast.error('Gagal menyimpan')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DONE': return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case 'IN_PROGRESS': return <Clock className="h-4 w-4 text-amber-500" />
      default: return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Wrench className="h-4 w-4" />
          Maintenance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance Kamar {roomNumber}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label>Jenis Maintenance</Label>
            <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis" />
              </SelectTrigger>
              <SelectContent>
                {MAINTENANCE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Deskripsi</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Deskripsi maintenance..."
            />
          </div>

          <div>
            <Label>Biaya (opsional)</Label>
            <Input
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              placeholder="0"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </form>

        {/* History */}
        {maintenance.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Riwayat Maintenance</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {maintenance.map((m) => (
                <div key={m.id} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                  {getStatusIcon(m.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{MAINTENANCE_TYPES.find(t => t.value === m.type)?.label}</span>
                      <Badge variant="outline" className="text-xs">{m.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{m.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{formatDate(new Date(m.date))}</span>
                      {m.cost && <span>{formatCurrency(Number(m.cost))}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
