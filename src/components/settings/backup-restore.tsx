'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { backupData, restoreData } from '@/actions/backup'
import { Download, Upload, Database, AlertTriangle } from 'lucide-react'

export function BackupRestore() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false)

  async function handleBackup() {
    setIsLoading(true)
    try {
      const result = await backupData()

      if (result.error) {
        toast.error(result.error)
      } else if (result.data) {
        // Download the JSON file
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `hotel-backup-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('Backup berhasil diunduh!')
      }
    } catch {
      toast.error('Terjadi kesalahan saat backup')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRestore(file: File) {
    setIsLoading(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      const result = await restoreData(data)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Restore berhasil! Data telah dikembalikan.')
        setShowRestoreConfirm(false)
        router.refresh()
      }
    } catch {
      toast.error('File tidak valid atau corrupted')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Backup & Restore Data
        </CardTitle>
        <CardDescription>
          Download backup data atau restore dari file backup sebelumnya
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Backup */}
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center gap-2">
              <Download className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">Backup Data</span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Download semua data hotel dalam format JSON. Simpan file ini di tempat yang aman.
            </p>
            <Button onClick={handleBackup} disabled={isLoading} variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              {isLoading ? 'Memproses...' : 'Download Backup'}
            </Button>
          </div>

          {/* Restore */}
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Restore Data</span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Restore data dari file backup JSON. Data saat ini akan digabungkan.
            </p>
            <label className="block">
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleRestore(file)
                }}
              />
              <Button variant="outline" className="w-full cursor-pointer" disabled={isLoading}>
                <Upload className="mr-2 h-4 w-4" />
                {isLoading ? 'Memproses...' : 'Pilih File Backup'}
              </Button>
            </label>
          </div>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium">Peringatan</p>
            <p className="text-xs">
              Restore akan menggabungkan data. Jika ada konflik (data dengan ID sama), data backup akan menimpa data lama.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
