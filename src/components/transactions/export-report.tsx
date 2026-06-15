'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Download, FileSpreadsheet } from 'lucide-react'
import * as XLSX from 'xlsx'
import { formatDate } from '@/lib/utils'

interface ExportReportProps {
  transactions: any[]
}

export function ExportReport({ transactions }: ExportReportProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  async function handleExport(type: 'transactions' | 'summary') {
    setIsExporting(true)

    try {
      let dataToExport = transactions

      if (startDate && endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)

        dataToExport = transactions.filter((t) => {
          const tDate = new Date(t.date)
          return tDate >= start && tDate <= end
        })
      }

      if (type === 'transactions') {
        const wsData = [
          ['No', 'Tanggal', 'Jenis', 'Kategori', 'Jumlah', 'Deskripsi'],
          ...dataToExport.map((t, i) => [
            i + 1,
            formatDate(t.date),
            t.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran',
            t.category.replace('_', ' '),
            Number(t.amount),
            t.description,
          ]),
        ]

        const ws = XLSX.utils.aoa_to_sheet(wsData)
        ws['!cols'] = [
          { wch: 5 },
          { wch: 15 },
          { wch: 12 },
          { wch: 15 },
          { wch: 15 },
          { wch: 30 },
        ]

        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Transaksi')

        const totalIncome = dataToExport
          .filter((t) => t.type === 'INCOME')
          .reduce((sum, t) => sum + Number(t.amount), 0)

        const totalExpense = dataToExport
          .filter((t) => t.type === 'EXPENSE')
          .reduce((sum, t) => sum + Number(t.amount), 0)

        const summaryData = [
          ['RINGKASAN LAPORAN'],
          ['Periode', startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : 'Semua'],
          ['Total Pemasukan', totalIncome],
          ['Total Pengeluaran', totalExpense],
          ['Laba/Rugi', totalIncome - totalExpense],
        ]

        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData)
        XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan')

        XLSX.writeFile(wb, `laporan-transaksi-${new Date().toISOString().split('T')[0]}.xlsx`)
      }

      toast.success('Export berhasil! File sedang diunduh.')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Gagal export laporan')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">Tanggal Mulai (Opsional)</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Tanggal Selesai (Opsional)</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={() => handleExport('transactions')} disabled={isExporting}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          {isExporting ? 'Memproses...' : 'Export Laporan Transaksi (XLSX)'}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        File akan di-export dalam format Excel (.xlsx). Jika tanggal tidak diisi, semua data akan di-export.
      </p>
    </div>
  )
}
