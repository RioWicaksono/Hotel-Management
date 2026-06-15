import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const roomId = request.nextUrl.searchParams.get('roomId')

    const where = roomId ? { roomId } : {}

    const maintenance = await prisma.maintenance.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 50,
      include: { room: true },
    })

    return NextResponse.json({ maintenance })
  } catch (error) {
    console.error('Get maintenance error:', error)
    return NextResponse.json({ error: 'Failed to fetch maintenance' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { roomId, type, description, cost } = body

    if (!roomId || !type || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const maintenance = await prisma.maintenance.create({
      data: {
        roomId,
        type,
        description,
        cost: cost ? cost : null,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ maintenance })
  } catch (error) {
    console.error('Create maintenance error:', error)
    return NextResponse.json({ error: 'Failed to create maintenance' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ maintenance })
  } catch (error) {
    console.error('Update maintenance error:', error)
    return NextResponse.json({ error: 'Failed to update maintenance' }, { status: 500 })
  }
}
