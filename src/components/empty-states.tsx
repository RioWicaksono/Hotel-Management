'use client'

import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'
import { Plus, Search, FileX, Users, Calendar, Receipt, Bed, AlertCircle } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 p-8 text-center ${className}`}>
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mb-4 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} asChild={!!action.href} className="bg-gradient-to-r from-pink-500 to-violet-500 hover:opacity-90">
          {action.href ? (
            <a href={action.href}>{action.label}</a>
          ) : (
            action.label
          )}
        </Button>
      )}
    </div>
  )
}

export function EmptyRooms({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={Bed}
      title="Belum Ada Kamar"
      description="Tambahkan kamar pertama untuk memulai"
      action={{ label: 'Tambah Kamar', onClick: onAdd }}
    />
  )
}

export function EmptyBookings({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={Calendar}
      title="Belum Ada Booking"
      description="Belum ada booking untuk periode ini"
      action={{ label: 'Tambah Booking', onClick: onAdd }}
    />
  )
}

export function EmptyGuests({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="Belum Ada Tamu"
      description="Tambahkan data tamu pertama"
      action={{ label: 'Tambah Tamu', onClick: onAdd }}
    />
  )
}

export function EmptyTransactions({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={Receipt}
      title="Belum Ada Transaksi"
      description="Mulai catat transaksi pertama"
      action={{ label: 'Tambah Transaksi', onClick: onAdd }}
    />
  )
}

export function EmptySearch({ query = '' }: { query?: string }) {
  return (
    <EmptyState
      icon={Search}
      title={`Tidak ditemukan "${query}"`}
      description="Coba kata kunci lain atau filter berbeda"
    />
  )
}

export function ErrorState({ message = 'Terjadi kesalahan', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Gagal Memuat Data"
      description={message}
      action={onRetry ? { label: 'Coba Lagi', onClick: onRetry } : undefined}
      className="border-red-500/20 bg-red-50/50 dark:bg-red-950/20"
    />
  )
}
