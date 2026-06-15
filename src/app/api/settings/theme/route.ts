import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'hotel_settings' },
    })

    return NextResponse.json({
      darkMode: settings?.darkMode || 'dark',
    })
  } catch (error) {
    console.error('Get theme error:', error)
    return NextResponse.json({ darkMode: 'dark' })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { darkMode } = body

    if (!darkMode || !['dark', 'light'].includes(darkMode)) {
      return NextResponse.json({ error: 'Invalid theme' }, { status: 400 })
    }

    await prisma.settings.upsert({
      where: { id: 'hotel_settings' },
      update: { darkMode },
      create: {
        id: 'hotel_settings',
        hotelName: 'Hotel Management',
        darkMode,
      },
    })

    return NextResponse.json({ success: true, darkMode })
  } catch (error) {
    console.error('Update theme error:', error)
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 })
  }
}
