import { prisma } from '@/lib/prisma'
import { ReportCards } from '@/components/transactions/report-cards'
import { PLReport } from '@/components/transactions/pl-report'
import { DailyCashReport } from '@/components/transactions/daily-cash-report'
import { ExportReport } from '@/components/transactions/export-report'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ReportsPage() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const [monthlyTransactions, allTransactions, rooms, bookings] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    }),
    prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      take: 500,
    }),
    prisma.room.findMany(),
    prisma.booking.findMany({
      where: {
        checkIn: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    }),
  ])

  const totalRooms = rooms.length
  const availableRooms = rooms.filter((r) => r.status === 'AVAILABLE').length
  const occupancyRate = totalRooms > 0 ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) : 0

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const monthlyExpense = monthlyTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Laporan</h1>
      </div>

      <ReportCards
        monthlyIncome={monthlyIncome}
        monthlyExpense={monthlyExpense}
        occupancyRate={occupancyRate}
        totalRooms={totalRooms}
        bookingsThisMonth={bookings.length}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PLReport
          startDate={startOfMonth}
          endDate={endOfMonth}
          transactions={monthlyTransactions}
        />
        <DailyCashReport />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <ExportReport transactions={allTransactions} />
        </CardContent>
      </Card>
    </div>
  )
}
