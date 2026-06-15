import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const dateParam = searchParams.get('date')

    if (!dateParam) {
      return NextResponse.json({ error: 'Date parameter required' }, { status: 400 })
    }

    const date = new Date(dateParam)
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        booking: {
          include: {
            guest: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    })

    const previousTransactions = await prisma.transaction.findMany({
      where: {
        date: { lt: startOfDay },
      },
    })

    const totalIncome = previousTransactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const totalExpense = previousTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const openingBalance = totalIncome - totalExpense

    const dayIncome = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const dayExpense = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    return NextResponse.json({
      date: dateParam,
      openingBalance,
      totalIncome: dayIncome,
      totalExpense: dayExpense,
      closingBalance: openingBalance + dayIncome - dayExpense,
      transactions,
    })
  } catch (error) {
    console.error('Daily cash report error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
