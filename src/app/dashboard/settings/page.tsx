import { prisma } from '@/lib/prisma'
import { UserManagement } from '@/components/settings/user-management'
import { HotelSettings } from '@/components/settings/hotel-settings'
import { BackupRestore } from '@/components/settings/backup-restore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function SettingsPage() {
  const [users, settings] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    }),
    prisma.settings.findUnique({
      where: { id: 'hotel_settings' },
    }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pengaturan</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Hotel</CardTitle>
        </CardHeader>
        <CardContent>
          <HotelSettings settings={settings} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manajemen User</CardTitle>
        </CardHeader>
        <CardContent>
          <UserManagement users={users} />
        </CardContent>
      </Card>

      <BackupRestore />
    </div>
  )
}
