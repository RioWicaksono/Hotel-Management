'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookingDialog } from './booking-dialog'
import { PrintReceipt } from '@/components/print/receipt'
import {
  cn,
  formatCurrency,
  formatDate,
  calculateNights,
  getPaymentStatusLabel,
  getPaymentStatusColor,
  getBookingSourceLabel,
} from '@/lib/utils'
import { Calendar, Phone, Home, CreditCard, Filter, CalendarRange } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface BookingListProps {
  bookings: any[]
  rooms: any[]
  guests: any[]
}

export function BookingList({ bookings, rooms, guests }: BookingListProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [dateFilter, setDateFilter] = useState('')

  const filteredBookings = bookings.filter((booking) => {
    const now = new Date()
    const checkOut = new Date(booking.checkOut)
    if (filter === 'active') return checkOut >= now
    if (filter === 'completed') return checkOut < now
    return true
  }).filter((booking) => {
    if (!dateFilter) return true
    const checkIn = new Date(booking.checkIn)
    const filterDate = new Date(dateFilter)
    return checkIn.toDateString() === filterDate.toDateString()
  })

  if (bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Belum Ada Booking</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Klik tombol "Tambah Booking" untuk menambahkan booking baru.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Semua
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Aktif
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Selesai
          </Button>
        </div>
        <div className="relative">
          <CalendarRange className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="pl-10 w-[160px]"
          />
        </div>
        {dateFilter && (
          <Button variant="ghost" size="sm" onClick={() => setDateFilter('')}>
            Clear
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Menampilkan {filteredBookings.length} dari {bookings.length} booking
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Kamar {booking.room.roomNumber}
                </CardTitle>
                <Badge className={cn('px-2 py-1', getPaymentStatusColor(booking.paymentStatus))}>
                  {getPaymentStatusLabel(booking.paymentStatus)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {getBookingSourceLabel(booking.source)}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{booking.guest.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{booking.guest.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {calculateNights(booking.checkIn, booking.checkOut)} malam •{' '}
                  <span className="font-semibold text-primary">
                    {formatCurrency(booking.totalAmount)}
                  </span>
                </span>
              </div>
              <div className="flex gap-2">
                <PrintReceipt
                  booking={booking}
                  type="booking"
                />
                <BookingDialog
                  booking={booking}
                  rooms={rooms}
                  guests={guests}
                  mode="edit"
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="flex-1">
                    Detail
                  </Button>
                </BookingDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {dateFilter ? 'Tidak ada booking untuk tanggal tersebut' : 'Tidak ada booking yang cocok'}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
