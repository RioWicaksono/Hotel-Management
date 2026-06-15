import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.bookingId },
      include: { room: true, guest: true },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Update booking to mark as checked out
    // We'll delete the booking and update room status
    await prisma.$transaction([
      // Update room status to AVAILABLE
      prisma.room.update({
        where: { id: booking.roomId },
        data: { status: 'AVAILABLE' },
      }),
      // Delete the booking
      prisma.booking.delete({
        where: { id: params.bookingId },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to checkout' }, { status: 500 })
  }
}
