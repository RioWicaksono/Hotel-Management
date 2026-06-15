import { prisma } from '@/lib/prisma'
import { BookingList } from '@/components/bookings/booking-list'
import { BookingDialog } from '@/components/bookings/booking-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-react'

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      room: true,
      guest: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const rooms = await prisma.room.findMany({
    where: { status: 'AVAILABLE' },
    orderBy: { roomNumber: 'asc' },
  })

  const guests = await prisma.guest.findMany({
    orderBy: { name: 'asc' },
  })

  // Stats
  const today = new Date()
  const todayBookings = bookings.filter((b) => {
    const checkIn = new Date(b.checkIn)
    return checkIn.toDateString() === today.toDateString()
  })
  const activeBookings = bookings.filter((b) => {
    const checkIn = new Date(b.checkIn)
    const checkOut = new Date(b.checkOut)
    return today >= checkIn && today <= checkOut
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Booking</h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span>{bookings.length} Total</span>
            <span>{activeBookings.length} Aktif</span>
            <span>{todayBookings.length} Check-in Hari Ini</span>
          </div>
        </div>
        <BookingDialog rooms={rooms} guests={guests} />
      </div>

      <BookingList bookings={bookings} rooms={rooms} guests={guests} />
    </div>
  )
}
