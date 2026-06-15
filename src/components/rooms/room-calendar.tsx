'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  Plus,
  UserCheck,
  LogOut,
  Bed,
  X,
  CalendarDays,
  Clock,
} from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { id } from 'date-fns/locale'
import { createBooking } from '@/actions/bookings'
import { createGuest } from '@/actions/guests'
import { updateRoomStatus } from '@/actions/rooms'

interface RoomCalendarProps {
  rooms: any[]
  bookings: any[]
}

const statusColors = {
  OCCUPIED: 'bg-gradient-to-br from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30',
  AVAILABLE: 'bg-gradient-to-br from-emerald-400 to-teal-400 text-white shadow-lg shadow-emerald-500/30',
  CLEANING: 'bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-500/30',
  MAINTENANCE: 'bg-gradient-to-br from-slate-400 to-gray-500 text-white shadow-lg',
}

export function RoomCalendar({ rooms, bookings }: RoomCalendarProps) {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedData, setSelectedData] = useState<any>(null)
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [nights, setNights] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  function getBookingForRoomAndDate(roomId: string, date: Date) {
    return bookings.find((b: any) => {
      if (b.roomId !== roomId) return false
      const checkIn = new Date(b.checkIn)
      const checkOut = new Date(b.checkOut)
      return date >= checkIn && date < checkOut
    })
  }

  function getRoomStatus(roomId: string, date: Date) {
    const booking = getBookingForRoomAndDate(roomId, date)
    if (booking) return 'OCCUPIED'
    const room = rooms.find((r: any) => r.id === roomId)
    return room?.status || 'AVAILABLE'
  }

  function handleCellClick(room: any, date: Date) {
    const status = getRoomStatus(room.id, date)
    setSelectedData({ room, date, status })
    setDialogOpen(true)
  }

  async function handleQuickCheckOut() {
    setIsLoading(true)
    try {
      // Update room to CLEANING
      await updateRoomStatus({ roomId: selectedData.room.id, status: 'CLEANING' })
      toast.success(`Kamar ${selectedData.room.roomNumber} siap dibersihkan!`)
      setDialogOpen(false)
      router.refresh()
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleQuickCheckIn() {
    if (!guestName || !guestPhone) {
      toast.error('Nama & telepon wajib diisi')
      return
    }
    setIsLoading(true)
    try {
      // Create guest
      const guestResult = await createGuest({ name: guestName, phone: guestPhone })
      if (guestResult.error) {
        toast.error(guestResult.error)
        setIsLoading(false)
        return
      }

      // Create booking
      const checkIn = selectedData.date
      const checkOut = new Date(checkIn)
      checkOut.setDate(checkOut.getDate() + nights)
      const total = Number(selectedData.room.price) * nights

      const bookingResult = await createBooking({
        roomId: selectedData.room.id,
        guestId: guestResult.guestId ?? '',
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        source: 'DIRECT',
        paymentStatus: 'PAID',
        totalAmount: total,
        paidAmount: total,
        notes: 'Quick check-in from calendar',
      })

      if (bookingResult.error) {
        toast.error(bookingResult.error)
      } else {
        toast.success(`Check-in Kamar ${selectedData.room.roomNumber} berhasil!`)
        setDialogOpen(false)
        setCheckInOpen(false)
        setGuestName('')
        setGuestPhone('')
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Room Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-2">
        <Button
          variant={selectedRoom === null ? 'default' : 'outline'}
          size="sm"
          className={cn(
            'flex-shrink-0 h-8 text-xs font-medium',
            selectedRoom === null && 'bg-gradient-to-r from-pink-500 to-violet-500'
          )}
          onClick={() => setSelectedRoom(null)}
        >
          Semua
        </Button>
        {rooms.map((room: any) => (
          <Button
            key={room.id}
            variant={selectedRoom === room.id ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'flex-shrink-0 h-8 text-xs font-medium gap-1',
              selectedRoom === room.id && 'bg-gradient-to-r from-pink-500 to-violet-500'
            )}
            onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
          >
            <Bed className="h-3 w-3" />
            {room.roomNumber}
          </Button>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-xl overflow-hidden shadow-lg">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gradient-to-r from-pink-500/10 to-violet-500/10">
          {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
            <div key={day} className="py-2.5 text-center text-xs font-bold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-t">
            {week.map((day, dayIndex) => {
              const isCurrentMonth = isSameMonth(day, currentDate)
              const today = isToday(day)

              if (selectedRoom) {
                const status = getRoomStatus(selectedRoom, day)
                const booking = getBookingForRoomAndDate(selectedRoom, day)

                return (
                  <div key={dayIndex}>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <button
                        className={cn(
                          'min-h-[65px] p-1.5 border-r border-b last:border-r-0 transition-all duration-200 hover:scale-105 cursor-pointer',
                          !isCurrentMonth && 'bg-muted/30',
                          today && 'ring-2 ring-pink-500 ring-inset'
                        )}
                        onClick={() => {
                          const room = rooms.find((r: any) => r.id === selectedRoom)
                          handleCellClick(room, day)
                        }}
                      >
                        <span className={cn('text-xs font-medium', today && 'text-pink-500 font-bold')}>
                          {format(day, 'd')}
                        </span>
                        {isCurrentMonth && (
                          <div className={cn('mt-1 rounded-lg px-1.5 py-1 text-[10px] font-medium', statusColors[status as keyof typeof statusColors])}>
                            {status === 'OCCUPIED' ? (
                              <span className="truncate">{booking?.guest?.name?.slice(0, 6)}</span>
                            ) : status === 'AVAILABLE' ? (
                              <span>✓</span>
                            ) : status === 'CLEANING' ? (
                              <span>🧹</span>
                            ) : (
                              <span>🔧</span>
                            )}
                          </div>
                        )}
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[350px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Bed className="h-5 w-5 text-pink-500" />
                          Kamar {selectedData?.room?.roomNumber}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarDays className="h-4 w-4" />
                          {format(selectedData?.date || new Date(), 'EEEE, d MMMM yyyy', { locale: id })}
                        </div>
                        <div className={cn('rounded-lg p-3 text-center', selectedData?.status === 'OCCUPIED' ? 'bg-red-500/10' : 'bg-emerald-500/10')}>
                          <p className="text-lg font-bold">
                            {selectedData?.status === 'OCCUPIEDED' ? 'KAMAR TERISI' : 'KAMAR TERSEDIA'}
                          </p>
                          {selectedData?.status === 'OCCUPIED' && selectedData?.room?.currentBooking && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedData.room.currentBooking.guest.name}
                            </p>
                          )}
                        </div>
                        {selectedData?.status === 'OCCUPIED' ? (
                          <Button
                            onClick={handleQuickCheckOut}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            {isLoading ? 'Memproses...' : 'Quick Check-out'}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              setCheckInOpen(true)
                            }}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90"
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Quick Check-in
                          </Button>
                        )}
                        {checkInOpen && (
                          <div className="space-y-3 border-t pt-4">
                            <div>
                              <Label>Nama Tamu</Label>
                              <Input
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="Nama lengkap"
                              />
                            </div>
                            <div>
                              <Label>Telepon</Label>
                              <Input
                                value={guestPhone}
                                onChange={(e) => setGuestPhone(e.target.value)}
                                placeholder="08xxxxxxxxxx"
                              />
                            </div>
                            <div>
                              <Label>Jumlah Malam</Label>
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <Button
                                    key={n}
                                    variant={nights === n ? 'default' : 'outline'}
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => setNights(n)}
                                  >
                                    {n}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            <Button
                              onClick={handleQuickCheckIn}
                              disabled={isLoading}
                              className="w-full bg-gradient-to-r from-pink-500 to-violet-500"
                            >
                              {isLoading ? 'Memproses...' : 'Konfirmasi Check-in'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                  </div>
                )
              }

              // Show all rooms
              const dayBookings = bookings.filter((b: any) => {
                const checkIn = new Date(b.checkIn)
                const checkOut = new Date(b.checkOut)
                return day >= checkIn && day < checkOut
              })

              return (
                <div
                  key={dayIndex}
                  className={cn(
                    'min-h-[65px] p-1.5 border-r border-b last:border-r-0',
                    !isCurrentMonth && 'bg-muted/30',
                    today && 'ring-2 ring-pink-500 ring-inset'
                  )}
                >
                  <span className={cn('text-xs font-medium', today && 'text-pink-500 font-bold')}>
                    {format(day, 'd')}
                  </span>
                  {isCurrentMonth && dayBookings.length > 0 && (
                    <div className="mt-1 space-y-0.5">
                      {dayBookings.slice(0, 2).map((b: any) => (
                        <div
                          key={b.id}
                          className="rounded bg-red-500 px-1 py-0.5 text-[10px] text-white truncate cursor-pointer hover:bg-red-600"
                        >
                          {b.room?.roomNumber} - {b.guest?.name?.slice(0, 5)}
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-[10px] text-muted-foreground">
                          +{dayBookings.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Navigation & Legend */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-red-500" />
            <span>Terisi</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-emerald-400" />
            <span>Tersedia</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-amber-400" />
            <span>Dibersihkan</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="h-8 w-8 p-0">
            <span className="sr-only">Previous</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {format(currentDate, 'MMMM yyyy', { locale: id })}
          </span>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="h-8 w-8 p-0">
            <span className="sr-only">Next</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}
