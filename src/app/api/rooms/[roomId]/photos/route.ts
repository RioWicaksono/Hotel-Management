import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: 'URL required' }, { status: 400 })
    }

    const room = await prisma.room.findUnique({
      where: { id: params.roomId },
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    const updatedRoom = await prisma.room.update({
      where: { id: params.roomId },
      data: {
        photos: [...(room.photos || []), url],
      },
    })

    return NextResponse.json({ photos: updatedRoom.photos })
  } catch (error) {
    console.error('Add photo error:', error)
    return NextResponse.json({ error: 'Failed to add photo' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: 'URL required' }, { status: 400 })
    }

    const room = await prisma.room.findUnique({
      where: { id: params.roomId },
    })

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    const updatedRoom = await prisma.room.update({
      where: { id: params.roomId },
      data: {
        photos: (room.photos || []).filter((p) => p !== url),
      },
    })

    return NextResponse.json({ photos: updatedRoom.photos })
  } catch (error) {
    console.error('Remove photo error:', error)
    return NextResponse.json({ error: 'Failed to remove photo' }, { status: 500 })
  }
}
