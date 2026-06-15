'use client'

import { cn } from '@/lib/utils'
import { RoomStatusBoardProps } from './types'
import { Bed, CheckCircle, User, Sparkles, Wrench } from 'lucide-react'

export function RoomStatusBoard({ stats }: RoomStatusBoardProps) {
  const statusItems = [
    {
      label: 'Total',
      value: stats.total,
      icon: Bed,
      gradient: 'from-slate-500 to-gray-600',
      textGradient: 'text-white',
    },
    {
      label: 'Tersedia',
      value: stats.available,
      icon: CheckCircle,
      gradient: 'from-emerald-400 to-teal-500',
      textGradient: 'text-white',
    },
    {
      label: 'Terisi',
      value: stats.occupied,
      icon: User,
      gradient: 'from-red-500 to-rose-600',
      textGradient: 'text-white',
    },
    {
      label: 'Bersih',
      value: stats.cleaning,
      icon: Sparkles,
      gradient: 'from-amber-400 to-orange-500',
      textGradient: 'text-white',
    },
    {
      label: 'Perbaikan',
      value: stats.maintenance,
      icon: Wrench,
      gradient: 'from-slate-400 to-gray-500',
      textGradient: 'text-white',
    },
  ]

  return (
    <div className="grid grid-cols-5 gap-2">
      {statusItems.map((item) => (
        <div
          key={item.label}
          className={cn(
            'relative overflow-hidden rounded-xl bg-gradient-to-br p-3 text-center shadow-lg',
            item.gradient
          )}
        >
          <div className="absolute inset-0 bg-white/10" />
          <div className="relative z-10">
            <item.icon className={cn('mx-auto h-5 w-5', item.textGradient)} />
            <p className={cn('mt-1 text-xl font-bold', item.textGradient)}>{item.value}</p>
            <p className="text-[10px] font-medium text-white/80">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
