'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Calendar } from 'lucide-react'

export function DailyCashReport() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [report, setReport] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function fetchReport() {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/reports/daily-cash?date=${date}`)
      const data = await res.json()
      setReport(data)
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laporan Kas Harian</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="date">Tanggal</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={fetchReport} disabled={isLoading}>
              <Calendar className="mr-2 h-4 w-4" />
              {isLoading ? 'Memuat...' : 'Tampilkan'}
            </Button>
          </div>
        </div>

        {report && (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <p className="mb-2 text-sm font-medium">Saldo Awal</p>
              <p className="text-xl font-bold">{formatCurrency(report.openingBalance)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm text-green-600">Total Pemasukan</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(report.totalIncome)}
                </p>
              </div>
              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-sm text-red-600">Total Pengeluaran</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(report.totalExpense)}
                </p>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <p className="mb-2 text-sm font-medium">Saldo Akhir</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(report.closingBalance)}
              </p>
            </div>

            {report.transactions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Transaksi Hari Ini:</p>
                {report.transactions.map((t: any) => (
                  <div key={t.id} className="flex justify-between text-sm">
                    <span>{t.description}</span>
                    <span className={t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
                      {t.type === 'INCOME' ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
