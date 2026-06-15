'use client'

import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface DashboardChartsProps {
  monthlyTransactions: any[]
  rooms: any[]
  compact?: boolean
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6b7280']

export function DashboardCharts({ monthlyTransactions, rooms, compact = false }: DashboardChartsProps) {
  // Prepare income/expense data for bar chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      date: date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
      income: 0,
      expense: 0,
    }
  })

  monthlyTransactions.forEach((t) => {
    const tDate = new Date(t.date)
    const dayIndex = last7Days.findIndex((d, idx) => {
      const dDate = new Date()
      dDate.setDate(dDate.getDate() - (6 - idx))
      return tDate.toDateString() === dDate.toDateString()
    })
    if (dayIndex >= 0) {
      if (t.type === 'INCOME') {
        last7Days[dayIndex].income += Number(t.amount)
      } else {
        last7Days[dayIndex].expense += Number(t.amount)
      }
    }
  })

  // Room status pie chart
  const roomStatus = [
    { name: 'Tersedia', value: rooms.filter((r) => r.status === 'AVAILABLE').length },
    { name: 'Terisi', value: rooms.filter((r) => r.status === 'OCCUPIED').length },
    { name: 'Bersih', value: rooms.filter((r) => r.status === 'CLEANING').length },
    { name: 'Perbaikan', value: rooms.filter((r) => r.status === 'MAINTENANCE').length },
  ]

  if (compact) {
    return (
      <div className="flex gap-4">
        {/* Bar Chart */}
        <div className="flex-1 h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days} barSize={12}>
              <XAxis dataKey="date" className="text-[10px]" tick={{ fontSize: 10 }} />
              <YAxis hide />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: '12px' }}
              />
              <Bar dataKey="income" fill="url(#gradientGreen)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mini Pie Chart */}
        <div className="w-[100px] h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={roomStatus}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={45}
                paddingAngle={2}
                dataKey="value"
              >
                {roomStatus.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Bar Chart */}
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={last7Days}>
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
            />
            <Bar dataKey="income" fill="url(#gradient1)" name="Pemasukan" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="flex items-center justify-between">
        <div className="h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={roomStatus}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {roomStatus.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {roomStatus.map((status, index) => (
            <div key={status.name} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
              <span className="text-sm">{status.name}</span>
              <span className="ml-auto font-semibold">{status.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
