import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { price, weekendPrice } = body

    if (!price || price <= 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
    }

    const room = await prisma.room.update({
      where: { id: params.roomId },
      data: {
        price,
        weekendPrice: weekendPrice || null,
      },
    })

    return NextResponse.json({ success: true, room })
  } catch (error) {
    console.error('Update price error:', error)
    return NextResponse.json({ error: 'Failed to update price' }, { status: 500 })
  }
}
