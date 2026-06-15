'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Calendar, Phone, MapPin } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

interface GuestHistoryProps {
  guest: {
    id: string
    name: string
    phone: string
    email?: string | null
    address?: string | null
    isLoyal: boolean
    visitCount: number
    lastVisit?: Date | null
    createdAt: Date
  }
  bookings: Array<{
    id: string
    checkIn: Date
    checkOut: Date
    totalAmount: number
    paymentStatus: string
    room: {
      roomNumber: string
      type: string
    }
  }>
}

export function GuestHistory({ guest, bookings }: GuestHistoryProps) {
  const totalSpent = bookings.reduce((sum, b) => sum + Number(b.totalAmount), 0)
  const avgPerVisit = bookings.length > 0 ? totalSpent / bookings.length : 0

  return (
    <div className="space-y-4">
      {/* Guest Info Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {guest.name}
              {guest.isLoyal && (
                <Badge className="bg-amber-500 gap-1">
                  <Star className="h-3 w-3" />
                  Langganan
                </Badge>
              )}
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {guest.visitCount} kali kunjungan
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              {guest.phone}
            </div>
            {guest.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {guest.email}
              </div>
            )}
          </div>

          {guest.lastVisit && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Kunjungan terakhir: {formatDate(new Date(guest.lastVisit))}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t">
            <div className="text-center">
              <p className="text-lg font-bold">{bookings.length}</p>
              <p className="text-xs text-muted-foreground">Total Booking</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-500">
                {formatCurrency(totalSpent)}
              </p>
              <p className="text-xs text-muted-foreground">Total Belanja</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-violet-500">
                {formatCurrency(avgPerVisit)}
              </p>
              <p className="text-xs text-muted-foreground">Rata-rata</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking History */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Riwayat Kunjungan</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              Belum ada riwayat kunjungan
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <div className="font-medium">Kamar {booking.room.roomNumber}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(new Date(booking.checkIn))} - {formatDate(new Date(booking.checkOut))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(booking.totalAmount)}</div>
                    <Badge
                      variant={booking.paymentStatus === 'PAID' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {booking.paymentStatus === 'PAID' ? 'Lunas' : 'Belum'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
