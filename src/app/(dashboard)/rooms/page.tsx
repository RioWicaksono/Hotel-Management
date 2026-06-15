import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { RoomCard, RoomCardSkeleton } from '@/components/rooms/room-card'
import { RoomStatusBoard } from '@/components/rooms/room-status-board'
import { RoomDialog } from '@/components/rooms/room-dialog'
import { BulkCheckout } from '@/components/rooms/bulk-checkout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'

async function RoomsData() {
  const [rooms, bookings, maintenance] = await Promise.all([
    prisma.room.findMany({ orderBy: { roomNumber: 'asc' } }),
    prisma.booking.findMany({
      include: { guest: true },
      where: {
        checkOut: { gte: new Date() },
      },
    }),
    prisma.maintenance.findMany({
      where: { status: { not: 'DONE' } },
      orderBy: { date: 'desc' },
    }),
  ])

  const stats = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === 'AVAILABLE').length,
    occupied: rooms.filter((r) => r.status === 'OCCUPIED').length,
    cleaning: rooms.filter((r) => r.status === 'CLEANING').length,
    maintenance: rooms.filter((r) => r.status === 'MAINTENANCE').length,
  }

  // Map current booking to each room
  const roomsWithBookings = rooms.map((room) => {
    const currentBooking = bookings.find((b) => b.roomId === room.id)
    const roomMaintenance = maintenance.filter((m) => m.roomId === room.id)
    return { room, currentBooking, maintenance: roomMaintenance }
  })

  return (
    <>
      <RoomStatusBoard stats={stats} />

      {/* Rooms Grid - Compact */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {roomsWithBookings.map(({ room, currentBooking, maintenance: roomMaintenance }) => (
          <RoomCard
            key={room.id}
            room={room}
            currentBooking={currentBooking}
            maintenance={roomMaintenance}
          />
        ))}
      </div>

      {rooms.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Belum Ada Kamar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Klik tombol "Tambah Kamar" untuk menambahkan kamar pertama.
            </p>
          </CardContent>
        </Card>
      )}
    </>
  )
}

function RoomsLoading() {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <RoomCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default async function RoomsPage() {
  const rooms = await prisma.room.findMany({ orderBy: { roomNumber: 'asc' } })
  const bookings = await prisma.booking.findMany({
    include: { guest: true },
    where: { checkOut: { gte: new Date() } },
  })

  // Prepare rooms with bookings for bulk checkout
  const roomsForBulk = rooms.map((room) => {
    const currentBooking = bookings.find((b) => b.roomId === room.id)
    return {
      ...room,
      currentBooking: currentBooking
        ? {
            id: currentBooking.id,
            guest: { name: currentBooking.guest.name },
            checkOut: currentBooking.checkOut,
            totalAmount: currentBooking.totalAmount,
          }
        : undefined,
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold">Manajemen Kamar</h1>
        <div className="flex gap-2">
          <BulkCheckout rooms={roomsForBulk} />
          <RoomDialog mode="create" />
        </div>
      </div>

      <Suspense fallback={<RoomsLoading />}>
        <RoomsData />
      </Suspense>
    </div>
  )
}
