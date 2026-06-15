'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { CheckCircle, Clock, LogOut, AlertCircle, Sparkles } from 'lucide-react'

interface TodayTasksProps {
  bookings: any[]
  rooms: any[]
}

export function TodayTasks({ bookings, rooms }: TodayTasksProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const checkOutToday = bookings.filter((b) => {
    const checkOut = new Date(b.checkOut)
    checkOut.setHours(0, 0, 0, 0)
    return checkOut.getTime() === today.getTime()
  })

  const checkInToday = bookings.filter((b) => {
    const checkIn = new Date(b.checkIn)
    checkIn.setHours(0, 0, 0, 0)
    return checkIn.getTime() === today.getTime()
  })

  const needCleaning = rooms.filter((r) => r.status === 'CLEANING')

  const totalTasks = checkOutToday.length + checkInToday.length + needCleaning.length

  if (totalTasks === 0) {
    return (
      <Card className="border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/5">
        <CardContent className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Tidak Ada Task Hari Ini
              </p>
              <p className="text-xs text-muted-foreground">Semua sudah teratur!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-pink-500/30 bg-gradient-to-r from-pink-500/5 to-violet-500/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-violet-500">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
            Task Hari Ini
          </span>
          <Badge className="bg-gradient-to-r from-pink-500 to-violet-500 text-white text-xs">
            {totalTasks}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {checkOutToday.length > 0 && (
          <div className="space-y-1.5">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <LogOut className="h-3.5 w-3.5" />
              Check-out ({checkOutToday.length})
            </p>
            {checkOutToday.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between rounded-lg border bg-gradient-to-r from-red-500/10 to-rose-500/5 p-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-rose-500 text-white text-xs font-bold">
                    {booking.room?.roomNumber}
                  </div>
                  <span className="text-sm font-medium">{booking.guest?.name}</span>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs bg-gradient-to-r from-amber-400 to-orange-400 text-white border-0 hover:opacity-90">
                  Check-out
                </Button>
              </div>
            ))}
          </div>
        )}

        {checkInToday.length > 0 && (
          <div className="space-y-1.5">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Check-in ({checkInToday.length})
            </p>
            {checkInToday.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between rounded-lg border bg-gradient-to-r from-emerald-500/10 to-teal-500/5 p-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs font-bold">
                    {booking.room?.roomNumber}
                  </div>
                  <span className="text-sm font-medium">{booking.guest?.name}</span>
                </div>
                <Badge variant="outline" className="h-7 text-xs bg-emerald-500/20 border-emerald-500/50 text-emerald-400">
                  🟢 Tamu datang
                </Badge>
              </div>
            ))}
          </div>
        )}

        {needCleaning.length > 0 && (
          <div className="space-y-1.5">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Perlu Dibersihkan ({needCleaning.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {needCleaning.map((room) => (
                <div key={room.id} className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-400/20 to-orange-400/10 border border-amber-500/30 px-2 py-1">
                  <span className="text-xs font-bold text-amber-400">{room.roomNumber}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
