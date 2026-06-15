import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Decimal } from '@prisma/client/runtime/library'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | Decimal | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : Number(amount)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

export function calculateNights(checkIn: Date | string, checkOut: Date | string): number {
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn
  const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut
  const diffTime = checkOutDate.getTime() - checkInDate.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getDateRangeArray(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = []
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

export function generateRoomStatusColor(status: string): string {
  switch (status) {
    case 'AVAILABLE':
      return 'text-green-600 bg-green-100'
    case 'OCCUPIED':
      return 'text-red-600 bg-red-100'
    case 'CLEANING':
      return 'text-yellow-600 bg-yellow-100'
    case 'MAINTENANCE':
      return 'text-gray-600 bg-gray-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'AVAILABLE':
      return 'Tersedia'
    case 'OCCUPIED':
      return 'Terisi'
    case 'CLEANING':
      return 'Dibersihkan'
    case 'MAINTENANCE':
      return 'Perbaikan'
    default:
      return status
  }
}

export function getPaymentStatusLabel(status: string): string {
  switch (status) {
    case 'UNPAID':
      return 'Belum Bayar'
    case 'DP':
      return 'DP'
    case 'PAID':
      return 'Lunas'
    default:
      return status
  }
}

export function getPaymentStatusColor(status: string): string {
  switch (status) {
    case 'UNPAID':
      return 'text-red-600 bg-red-100'
    case 'DP':
      return 'text-yellow-600 bg-yellow-100'
    case 'PAID':
      return 'text-green-600 bg-green-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getBookingSourceLabel(source: string): string {
  switch (source) {
    case 'DIRECT':
      return 'Langsung'
    case 'REDDOORZ':
      return 'RedDoorz'
    default:
      return source
  }
}
