import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { FloatingAction } from '@/components/floating-action'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  let settings = null
  let rooms: any[] = []
  let guests: any[] = []

  try {
    settings = await prisma.settings.findUnique({
      where: { id: 'hotel_settings' },
    })

    rooms = await prisma.room.findMany({ orderBy: { roomNumber: 'asc' } })
    guests = await prisma.guest.findMany({
      orderBy: { name: 'asc' },
    })
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar hotelName={settings?.hotelName || 'Hotel Management'} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader user={session.user!} hotelName={settings?.hotelName} />
        <main className="flex-1 overflow-y-auto p-4 bg-background">
          {children}
        </main>
      </div>
      <FloatingAction rooms={rooms} guests={guests} />
    </div>
  )
}
