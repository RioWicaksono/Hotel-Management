import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')?.trim()

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    const [rooms, guests, bookings] = await Promise.all([
      prisma.room.findMany({
        where: {
          OR: [
            { roomNumber: { contains: query, mode: 'insensitive' } },
            { type: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      prisma.guest.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      prisma.booking.findMany({
        where: {
          OR: [
            { id: { contains: query, mode: 'insensitive' } },
            { notes: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: {
          room: true,
          guest: true,
        },
        take: 5,
      }),
    ])

    const results = [
      ...rooms.map((room) => ({
        type: 'room' as const,
        id: room.id,
        title: `Kamar ${room.roomNumber}`,
        subtitle: `${room.type} - ${room.status}`,
        href: `/rooms`,
      })),
      ...guests.map((guest) => ({
        type: 'guest' as const,
        id: guest.id,
        title: guest.name,
        subtitle: guest.phone,
        href: `/guests`,
      })),
      ...bookings.map((booking) => ({
        type: 'booking' as const,
        id: booking.id,
        title: `Booking ${booking.room.roomNumber}`,
        subtitle: `${booking.guest.name} - ${booking.checkIn.toLocaleDateString('id-ID')}`,
        href: `/bookings`,
      })),
    ]

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
