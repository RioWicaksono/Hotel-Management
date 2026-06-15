'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const TransactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.enum(['ROOM_INCOME', 'FOOD_BEVERAGE', 'MAINTENANCE', 'UTILITIES', 'SUPPLIES', 'MARKETING', 'OTHER']),
  amount: z.number().positive('Jumlah harus positif'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  date: z.string().min(1, 'Tanggal wajib diisi'),
  bookingId: z.string().optional(),
})

export async function createTransaction(data: z.infer<typeof TransactionSchema>) {
  try {
    const validation = TransactionSchema.safeParse(data)
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    await prisma.transaction.create({
      data: {
        type: data.type,
        category: data.category,
        amount: data.amount,
        description: data.description,
        date: new Date(data.date),
        bookingId: data.bookingId,
      },
    })

    revalidatePath('/transactions')
    return { success: true }
  } catch (error) {
    console.error('Create transaction error:', error)
    return { error: 'Terjadi kesalahan saat membuat transaksi' }
  }
}

export async function getTransactionsByDateRange(startDate: Date, endDate: Date) {
  return prisma.transaction.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      booking: {
        include: {
          guest: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  })
}

export async function getDailyCashReport(date: Date) {
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

  return {
    date,
    openingBalance,
    totalIncome: dayIncome,
    totalExpense: dayExpense,
    closingBalance: openingBalance + dayIncome - dayExpense,
    transactions,
  }
}

export async function getPLReport(startDate: Date, endDate: Date) {
  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  })

  const totalRoomIncome = transactions
    .filter((t) => t.type === 'INCOME' && t.category === 'ROOM_INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const expensesByCategory = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount)
      return acc
    }, {} as Record<string, number>)

  return {
    startDate,
    endDate,
    totalRoomIncome,
    totalExpense,
    profit: totalRoomIncome - totalExpense,
    expensesByCategory,
  }
}
