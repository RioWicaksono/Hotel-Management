'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative mx-auto h-32 w-32">
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500/20 to-violet-500/20">
              <span className="text-6xl font-bold text-muted-foreground">404</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="mb-2 text-2xl font-bold text-foreground">Halaman Tidak Ditemukan</h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          Maaf, halaman yang Anda cari tidak ditemukan. Mungkin sudah dipindahkan atau dihapus.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="bg-gradient-to-r from-pink-500 to-violet-500 hover:opacity-90">
            <Link href="/rooms">
              <Home className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Halaman Sebelumnya
          </Button>
        </div>
      </div>
    </div>
  )
}
