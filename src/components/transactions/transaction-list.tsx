'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TransactionDialog } from './transaction-dialog'
import { Input } from '@/components/ui/input'
import { Search, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface TransactionListProps {
  transactions: any[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      (t.booking?.guest?.name || '').toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === 'all' || (filter === 'income' && t.type === 'INCOME') || (filter === 'expense' && t.type === 'EXPENSE')
    return matchesSearch && matchesFilter
  })

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Belum Ada Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Klik tombol "Tambah Transaksi" untuk menambahkan transaksi baru.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari transaksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Semua
          </Button>
          <Button
            variant={filter === 'income' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('income')}
          >
            Masuk
          </Button>
          <Button
            variant={filter === 'expense' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('expense')}
          >
            Keluar
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    transaction.type === 'INCOME' ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {transaction.type === 'INCOME' ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(transaction.date)}
                    {transaction.booking && ` • ${transaction.booking.guest.name}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-bold ${
                    transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'INCOME' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
                <Badge
                  variant="outline"
                  className={
                    transaction.type === 'INCOME'
                      ? 'border-green-200 text-green-600'
                      : 'border-red-200 text-red-600'
                  }
                >
                  {transaction.category.replace('_', ' ')}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
