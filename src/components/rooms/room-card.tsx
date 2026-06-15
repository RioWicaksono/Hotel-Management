'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatDate, formatCurrency } from '@/lib/utils'
import { RoomCardProps } from './types'
import { RoomDialog } from './room-dialog'
import { RoomPhotoUpload } from './room-photo-upload'
import { MaintenanceLog } from './maintenance-log'
import { Pencil, Bed, User, Calendar, Sparkles, Wrench, CheckCircle, Image as ImageIcon, Star } from 'lucide-react'
import { updateRoomStatus } from '@/actions/rooms'

const statusColors = {
  AVAILABLE: {
    badge: 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white',
    card: 'border-l-4 border-l-emerald-500',
    icon: 'text-emerald-400',
    bg: 'bg-gradient-to-br from-emerald-400/20 to-teal-400/10',
    glow: 'shadow-emerald-500/20',
  },
  OCCUPIED: {
    badge: 'bg-gradient-to-r from-red-500 to-rose-500 text-white',
    card: 'border-l-4 border-l-red-500',
    icon: 'text-red-400',
    bg: 'bg-gradient-to-br from-red-500/20 to-rose-500/10',
    glow: 'shadow-red-500/20',
  },
  CLEANING: {
    badge: 'bg-gradient-to-r from-amber-400 to-orange-400 text-white',
    card: 'border-l-4 border-l-amber-500',
    icon: 'text-amber-400',
    bg: 'bg-gradient-to-br from-amber-400/20 to-orange-400/10',
    glow: 'shadow-amber-500/20',
  },
  MAINTENANCE: {
    badge: 'bg-gradient-to-r from-slate-400 to-gray-500 text-white',
    card: 'border-l-4 border-l-slate-500',
    icon: 'text-slate-400',
    bg: 'bg-gradient-to-br from-slate-400/20 to-gray-500/10',
    glow: 'shadow-slate-500/20',
  },
}

interface RoomCardWithBooking extends RoomCardProps {
  currentBooking?: {
    id: string
    guest: { name: string }
    checkOut: Date
    totalAmount: number | { toString(): string }
  }
  maintenance?: Array<{
    id: string
    type: string
    description: string
    cost: number | null | { toString(): string }
    status: string
    date: Date
  }>
}

export function RoomCard({ room, currentBooking, maintenance = [] }: RoomCardWithBooking) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const colors = statusColors[room.status as keyof typeof statusColors] || statusColors.MAINTENANCE
  const isWeekend = [0, 6].includes(new Date().getDay())
  const displayPrice = isWeekend && room.weekendPrice ? Number(room.weekendPrice) : Number(room.price)

  async function handleQuickStatus(status: 'AVAILABLE' | 'CLEANING' | 'MAINTENANCE') {
    if (room.status === status) return
    setIsUpdating(true)
    try {
      const result = await updateRoomStatus({ roomId: room.id, status })
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(`Status berubah ke ${status === 'AVAILABLE' ? 'Tersedia' : status === 'CLEANING' ? 'Dibersihkan' : 'Perbaikan'}`)
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className={cn('card-hover transition-all duration-200 overflow-hidden', colors.card, colors.glow)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', colors.bg)}>
              <Bed className={cn('h-5 w-5', colors.icon)} />
            </div>
            <div>
              <h3 className="text-base font-bold">Kamar {room.roomNumber}</h3>
              <p className="text-xs text-muted-foreground">{room.type}</p>
            </div>
          </div>
          <Badge className={cn('px-2.5 py-0.5 text-xs font-medium shadow-lg', colors.badge)}>
            {room.status === 'AVAILABLE' ? '✓ Tersedia' : room.status === 'OCCUPIED' ? '✗ Terisi' : room.status === 'CLEANING' ? '🧹 Bersih' : '🔧 Perbaikan'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {/* Photo Preview */}
        {room.photos && room.photos.length > 0 && (
          <div className="relative h-20 rounded-lg overflow-hidden">
            <img
              src={room.photos[0]}
              alt={`Kamar ${room.roomNumber}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 right-1 bg-black/60 rounded px-1.5 py-0.5 text-xs text-white flex items-center gap-1">
              <ImageIcon className="h-3 w-3" />
              {room.photos.length}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Harga:</span>
          <span className="font-semibold">
            {formatCurrency(displayPrice)}/mlm
            {isWeekend && room.weekendPrice && (
              <Badge variant="outline" className="ml-1 text-[10px] bg-amber-500/20 border-amber-500/50 text-amber-400">
                <Star className="h-2 w-2 mr-0.5" />
                Weekend
              </Badge>
            )}
          </span>
        </div>

        {/* Current Booking Info */}
        {room.status === 'OCCUPIED' && currentBooking && (
          <div className={cn('rounded-lg p-2.5 space-y-1', colors.bg)}>
            <div className="flex items-center gap-1.5 text-xs">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-semibold truncate">{currentBooking.guest.name}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>Check-out: {formatDate(currentBooking.checkOut)}</span>
            </div>
          </div>
        )}

        {/* Status Pills */}
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className={cn(
              'flex-1 h-8 text-xs gap-1 transition-all',
              room.status === 'AVAILABLE'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30'
                : 'hover:bg-emerald-500/20 hover:border-emerald-500/50'
            )}
            onClick={() => handleQuickStatus('AVAILABLE')}
            disabled={isUpdating || room.status === 'AVAILABLE'}
          >
            <CheckCircle className="h-3 w-3" />
            Tersedia
          </Button>

          <Button
            size="sm"
            variant="outline"
            className={cn(
              'flex-1 h-8 text-xs gap-1 transition-all',
              room.status === 'CLEANING'
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30'
                : 'hover:bg-amber-500/20 hover:border-amber-500/50'
            )}
            onClick={() => handleQuickStatus('CLEANING')}
            disabled={isUpdating || room.status === 'CLEANING'}
          >
            <Sparkles className="h-3 w-3" />
            Bersih
          </Button>

          <Button
            size="sm"
            variant="outline"
            className={cn(
              'flex-1 h-8 text-xs gap-1 transition-all',
              room.status === 'MAINTENANCE'
                ? 'bg-slate-500/20 border-slate-500/50 text-slate-400 hover:bg-slate-500/30'
                : 'hover:bg-slate-500/20 hover:border-slate-500/50'
            )}
            onClick={() => handleQuickStatus('MAINTENANCE')}
            disabled={isUpdating || room.status === 'MAINTENANCE'}
          >
            <Wrench className="h-3 w-3" />
            Perbaikan
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1">
          <RoomPhotoUpload
            roomId={room.id}
            roomNumber={room.roomNumber}
            photos={room.photos || []}
          />
          <MaintenanceLog
            roomId={room.id}
            roomNumber={room.roomNumber}
            maintenance={maintenance}
          />
        </div>

        {/* Edit Button */}
        <RoomDialog mode="edit" room={room}>
          <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1">
            <Pencil className="h-3 w-3" />
            Edit Detail
          </Button>
        </RoomDialog>
      </CardContent>
    </Card>
  )
}

export function RoomCardSkeleton() {
  return (
    <Card className="animate-pulse overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted" />
            <div>
              <div className="h-4 w-16 rounded bg-muted" />
              <div className="mt-1 h-3 w-12 rounded bg-muted" />
            </div>
          </div>
          <div className="h-6 w-20 rounded bg-muted" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        <div className="h-14 rounded-lg bg-muted" />
        <div className="h-8 rounded-lg bg-muted" />
      </CardContent>
    </Card>
  )
}
