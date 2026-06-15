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
import { createTransaction } from '@/actions/transactions'
import { Plus } from 'lucide-react'

interface TransactionDialogProps {
  transaction?: any
  children?: React.ReactNode
}

export function TransactionDialog({ children }: TransactionDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'INCOME',
    category: 'ROOM_INCOME',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  })

  const expenseCategories = [
    { value: 'MAINTENANCE', label: 'Perbaikan' },
    { value: 'UTILITIES', label: 'Utilitas (Listrik, Air)' },
    { value: 'SUPPLIES', label: 'Perlengkapan' },
    { value: 'MARKETING', label: 'Marketing' },
    { value: 'OTHER', label: 'Lainnya' },
  ]

  const incomeCategories = [
    { value: 'ROOM_INCOME', label: 'Kamar' },
    { value: 'FOOD_BEVERAGE', label: 'Makanan & Minuman' },
    { value: 'OTHER', label: 'Lainnya' },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createTransaction({
        type: formData.type as 'INCOME' | 'EXPENSE',
        category: formData.category as any,
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: formData.date,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Transaksi berhasil ditambahkan')
        setIsOpen(false)
        setFormData({
          type: 'INCOME',
          category: 'ROOM_INCOME',
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
        })
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
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Transaksi
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Transaksi Baru</DialogTitle>
            <DialogDescription>Tambahkan transaksi pemasukan atau pengeluaran</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Jenis Transaksi</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    type: value,
                    category: value === 'INCOME' ? 'ROOM_INCOME' : 'MAINTENANCE',
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INCOME">Pemasukan</SelectItem>
                  <SelectItem value="EXPENSE">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {(formData.type === 'INCOME' ? incomeCategories : expenseCategories).map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Jumlah (IDR)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="150000"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi transaksi"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Memproses...' : 'Tambah'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
