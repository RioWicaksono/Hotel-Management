import { prisma } from '@/lib/prisma'
import { GuestList } from '@/components/guests/guest-list'
import { GuestDialog } from '@/components/guests/guest-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Users } from 'lucide-react'

export default async function GuestsPage() {
  const guests = await prisma.guest.findMany({
    include: {
      bookings: {
        include: {
          room: true,
        },
        orderBy: { checkIn: 'desc' },
        take: 5,
      },
    },
    orderBy: { name: 'asc' },
  })

  const loyalGuests = guests.filter((g) => g.isLoyal)
  const totalGuests = guests.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Tamu</h1>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              {totalGuests} Total
            </Badge>
            <Badge className="bg-amber-500 gap-1">
              <Star className="h-3 w-3" />
              {loyalGuests.length} Langganan
            </Badge>
          </div>
        </div>
        <GuestDialog />
      </div>

      <GuestList guests={guests} />

      {guests.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Belum Ada Tamu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Klik tombol "Tambah Tamu" untuk menambahkan tamu baru.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
