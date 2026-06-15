import { prisma } from '@/lib/prisma'
import { RoomCalendar } from '@/components/rooms/room-calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, ArrowUpDown } from 'lucide-react'

export default async function CalendarPage() {
  const [rooms, bookings] = await Promise.all([
    prisma.room.findMany({ orderBy: { roomNumber: 'asc' } }),
    prisma.booking.findMany({
      include: { guest: true, room: true },
      orderBy: { checkIn: 'asc' },
    }),
  ])

  const stats = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === 'AVAILABLE').length,
    occupied: rooms.filter((r) => r.status === 'OCCUPIED').length,
    cleaning: rooms.filter((r) => r.status === 'CLEANING').length,
  }

  const upcomingBookings = bookings.filter((b) => new Date(b.checkIn) >= new Date())

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Kalender</h1>
      </div>

      {/* Quick Stats - Compact */}
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-lg border bg-card p-2 text-center">
          <p className="text-lg font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="rounded-lg border bg-emerald-50 p-2 text-center dark:bg-emerald-950">
          <p className="text-lg font-bold text-emerald-600">{stats.available}</p>
          <p className="text-xs text-emerald-600">Tersedia</p>
        </div>
        <div className="rounded-lg border bg-red-50 p-2 text-center dark:bg-red-950">
          <p className="text-lg font-bold text-red-600">{stats.occupied}</p>
          <p className="text-xs text-red-600">Terisi</p>
        </div>
        <div className="rounded-lg border bg-amber-50 p-2 text-center dark:bg-amber-950">
          <p className="text-lg font-bold text-amber-600">{stats.cleaning}</p>
          <p className="text-xs text-amber-600">Bersih</p>
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Ketersediaan Kamar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <RoomCalendar rooms={rooms} bookings={bookings} />
        </CardContent>
      </Card>

      {/* Upcoming Bookings - Compact List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Booking Mendatang ({upcomingBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {upcomingBookings.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">Tidak ada booking mendatang</p>
          ) : (
            <div className="max-h-[200px] overflow-y-auto divide-y">
              {upcomingBookings.slice(0, 15).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between px-4 py-2 text-sm hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold">
                      {booking.room?.roomNumber}
                    </div>
                    <div>
                      <p className="font-medium">{booking.guest?.name}</p>
                      <p className="text-xs text-muted-foreground">{booking.guest?.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs">
                      {new Date(booking.checkIn).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </p>
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      booking.source === 'REDDOORZ'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-400'
                    }`}>
                      {booking.source === 'REDDOORZ' ? 'RedDoorz' : 'Langsung'}
                    </span>
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
