'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Bed, Users, Calendar, TrendingUp, AlertCircle, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface DashboardQuickStatsProps {
  stats: {
    totalRooms: number
    availableRooms: number
    occupiedRooms: number
    cleaningRooms: number
    maintenanceRooms: number
    totalGuests: number
    todayCheckIn: number
    todayCheckOut: number
    monthlyRevenue: number
    monthlyExpense: number
    occupancyRate: number
  }
}

export function DashboardQuickStats({ stats }: DashboardQuickStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {/* Today's Activity */}
      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Check-in Hari Ini</p>
              <p className="text-2xl font-bold">{stats.todayCheckIn}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
              <Calendar className="h-5 w-5 text-amber-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Check-out Hari Ini</p>
              <p className="text-2xl font-bold">{stats.todayCheckOut}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
              <Clock className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Status */}
      <Card className="border-l-4 border-l-emerald-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Kamar Tersedia</p>
              <p className="text-2xl font-bold">{stats.availableRooms}</p>
              <p className="text-[10px] text-muted-foreground">/ {stats.totalRooms} kamar</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20">
              <Bed className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-violet-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Occupancy Rate</p>
              <p className="text-2xl font-bold">{stats.occupancyRate}%</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20">
              <TrendingUp className="h-5 w-5 text-violet-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-pink-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total Tamu</p>
              <p className="text-2xl font-bold">{stats.totalGuests}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/20">
              <Users className="h-5 w-5 text-pink-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Financial */}
      <Card className="border-l-4 border-l-teal-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pendapatan Bulan Ini</p>
              <p className="text-lg font-bold text-teal-500">
                {formatCurrency(stats.monthlyRevenue)}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/20">
              <TrendingUp className="h-5 w-5 text-teal-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Breakdown */}
      <Card className="col-span-2 md:col-span-4 lg:col-span-5 xl:col-span-2 border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-3">Status Kamar</p>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xl font-bold text-emerald-500">{stats.availableRooms}</p>
              <p className="text-[10px] text-muted-foreground">Tersedia</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-red-500">{stats.occupiedRooms}</p>
              <p className="text-[10px] text-muted-foreground">Terisi</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-amber-500">{stats.cleaningRooms}</p>
              <p className="text-[10px] text-muted-foreground">Cleaning</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-500">{stats.maintenanceRooms}</p>
              <p className="text-[10px] text-muted-foreground">Maintenance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
