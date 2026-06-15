'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TransactionCategory } from '@prisma/client'

interface PLReportProps {
  startDate: Date
  endDate: Date
  transactions: any[]
}

const categoryLabels: Record<TransactionCategory, string> = {
  ROOM_INCOME: 'Kamar',
  FOOD_BEVERAGE: 'Makanan & Minuman',
  MAINTENANCE: 'Perbaikan',
  UTILITIES: 'Utilitas',
  SUPPLIES: 'Perlengkapan',
  MARKETING: 'Marketing',
  OTHER: 'Lainnya',
}

export function PLReport({ startDate, endDate, transactions }: PLReportProps) {
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const expensesByCategory = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount)
      return acc
    }, {} as Record<string, number>)

  const profit = totalIncome - totalExpense

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laporan Laba/Rugi</CardTitle>
        <p className="text-sm text-muted-foreground">
          {formatDate(startDate)} - {formatDate(endDate)}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Pemasukan Kamar</span>
            <span className="font-medium text-green-600">
              {formatCurrency(expensesByCategory['ROOM_INCOME'] || 0)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Pemasukan Lainnya</span>
            <span className="font-medium text-green-600">
              {formatCurrency(
                totalIncome - (expensesByCategory['ROOM_INCOME'] || 0)
              )}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2 font-semibold">
            <span>Total Pemasukan</span>
            <span className="text-green-600">{formatCurrency(totalIncome)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Pengeluaran:</p>
          {Object.entries(expensesByCategory).map(([category, amount]) => (
            <div key={category} className="flex justify-between text-sm">
              <span>{categoryLabels[category as TransactionCategory]}</span>
              <span className="text-red-600">{formatCurrency(amount as number)}</span>
            </div>
          ))}
          {Object.keys(expensesByCategory).length === 0 && (
            <p className="text-sm text-muted-foreground">Tidak ada pengeluaran</p>
          )}
          <div className="flex justify-between border-t pt-2 font-semibold">
            <span>Total Pengeluaran</span>
            <span className="text-red-600">{formatCurrency(totalExpense)}</span>
          </div>
        </div>

        <div className="flex justify-between border-t border-b py-3 font-bold text-lg">
          <span>Laba/Rugi</span>
          <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
            {formatCurrency(profit)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
