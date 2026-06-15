import { prisma } from '@/lib/prisma'
import { TransactionList } from '@/components/transactions/transaction-list'
import { TransactionDialog } from '@/components/transactions/transaction-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function TransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    include: {
      booking: {
        include: {
          guest: true,
        },
      },
    },
    orderBy: { date: 'desc' },
    take: 100,
  })

  const totalIncome = await prisma.transaction.aggregate({
    where: { type: 'INCOME' },
    _sum: { amount: true },
  })

  const totalExpense = await prisma.transaction.aggregate({
    where: { type: 'EXPENSE' },
    _sum: { amount: true },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transaksi</h1>
        <TransactionDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Total Pemasukan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(Number(totalIncome._sum.amount || 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Total Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(Number(totalExpense._sum.amount || 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(Number(totalIncome._sum.amount || 0) - Number(totalExpense._sum.amount || 0))}
            </p>
          </CardContent>
        </Card>
      </div>

      <TransactionList transactions={transactions} />
    </div>
  )
}
