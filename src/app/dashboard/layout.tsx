import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { FloatingAction } from '@/components/floating-action'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  let settings = null
  let rooms: any[] = []
  let guests: any[] = []

  try {
    settings = await prisma.settings.findUnique({ where: { id: 'hotel_settings' })
    rooms = await prisma.room.findMany({ orderBy: { roomNumber: 'asc' })
    guests = await prisma.guest.findMany({ orderBy: { name: 'asc' })
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  return (
    <DashboardSidebar hotelName={settings?.hotelName || 'Losmen Sejahtera'}>
      <div className="flex-1 lg:ml-64">
        <main className="p-4 lg:p-6">
          {children}
        </main>
        <FloatingAction rooms={rooms} guests={guests} />
      </div>
    </DashboardSidebar>
  )
}
