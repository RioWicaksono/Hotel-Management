'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Calendar, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface RecentActivityProps {
  bookings: any[]
  transactions: any[]
}

export function RecentActivity({ bookings, transactions }: RecentActivityProps) {
  return (
    <div className="space-y-6">
      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Booking Aktif
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Tidak ada booking aktif saat ini
            </p>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{booking.guest.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Kamar {booking.room.roomNumber} • {formatDate(booking.checkOut)}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    booking.paymentStatus === 'PAID'
                      ? 'bg-emerald-100 text-emerald-700'
                      : booking.paymentStatus === 'DP'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {booking.paymentStatus === 'PAID' ? 'Lunas' : booking.paymentStatus === 'DP' ? 'DP' : 'Belum'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Transaksi Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Belum ada transaksi
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${
                      tx.type === 'INCOME' ? 'bg-emerald-100' : 'bg-red-100'
                    }`}>
                      {tx.type === 'INCOME' ? (
                        <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(tx.date)}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {tx.type === 'INCOME' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
