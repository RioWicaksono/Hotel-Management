import { prisma } from '@/lib/prisma'
import { DashboardCharts } from '@/components/dashboard/dashboard-charts'
import { TodayTasks } from '@/components/dashboard/today-tasks'
import { QuickCheckIn } from '@/components/dashboard/quick-checkin'
import { WalkInCheckIn } from '@/components/checkin/walk-in'
import { DashboardQuickStats } from '@/components/dashboard/quick-stats'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Bed, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react'

export default async function DashboardPage() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const [rooms, bookings, transactions, guests, monthlyTransactions, loyalGuests] = await Promise.all([
    prisma.room.findMany({ orderBy: { roomNumber: 'asc' } }),
    prisma.booking.findMany({
      include: { room: true, guest: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      take: 20,
    }),
    prisma.guest.count(),
    prisma.transaction.findMany({
      where: { date: { gte: startOfMonth, lte: endOfMonth } },
    }),
    prisma.guest.findMany({
      where: { isLoyal: true },
      orderBy: { visitCount: 'desc' },
      take: 10,
    }),
  ])

  // Calculate today's check-in and check-out
  const todayCheckIn = bookings.filter((b) => {
    const checkIn = new Date(b.checkIn)
    return checkIn >= today && checkIn < tomorrow
  }).length

  const todayCheckOut = bookings.filter((b) => {
    const checkOut = new Date(b.checkOut)
    return checkOut >= today && checkOut < tomorrow
  }).length

  const stats = {
    totalRooms: rooms.length,
    availableRooms: rooms.filter((r) => r.status === 'AVAILABLE').length,
    occupiedRooms: rooms.filter((r) => r.status === 'OCCUPIED').length,
    cleaningRooms: rooms.filter((r) => r.status === 'CLEANING').length,
    maintenanceRooms: rooms.filter((r) => r.status === 'MAINTENANCE').length,
    totalGuests: guests,
    todayCheckIn,
    todayCheckOut,
    monthlyRevenue: monthlyTransactions.filter((t) => t.type === 'INCOME').reduce((sum, t) => sum + Number(t.amount), 0),
    monthlyExpense: monthlyTransactions.filter((t) => t.type === 'EXPENSE').reduce((sum, t) => sum + Number(t.amount), 0),
    occupancyRate: rooms.length > 0 ? Math.round(((rooms.length - rooms.filter((r) => r.status === 'AVAILABLE').length) / rooms.length) * 100) : 0,
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <div className="flex gap-2">
          <WalkInCheckIn rooms={rooms} loyalGuests={loyalGuests} />
          <QuickCheckIn rooms={rooms.filter((r) => r.status === 'AVAILABLE')} />
        </div>
      </div>

      {/* Quick Stats */}
      <DashboardQuickStats stats={stats} />

      {/* Today's Tasks */}
      <TodayTasks bookings={bookings} rooms={rooms} />

      {/* Bottom Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Chart */}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-pink-500" />
              Grafik Pendapatan
            </p>
            <DashboardCharts monthlyTransactions={monthlyTransactions} rooms={rooms} compact />
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-medium">
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              Transaksi Terakhir
            </p>
            <div className="space-y-2 max-h-[180px] overflow-y-auto">
              {transactions.slice(0, 6).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${tx.type === 'INCOME' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                      {tx.type === 'INCOME' ? (
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <span className="truncate max-w-[140px]">{tx.description}</span>
                  </div>
                  <span className={`font-semibold ${tx.type === 'INCOME' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">Belum ada transaksi</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
