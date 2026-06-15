'use server'

import { prisma } from '@/lib/prisma'

export async function backupData() {
  try {
    const [users, rooms, guests, bookings, transactions, settings] = await Promise.all([
      prisma.user.findMany(),
      prisma.room.findMany(),
      prisma.guest.findMany(),
      prisma.booking.findMany(),
      prisma.transaction.findMany(),
      prisma.settings.findMany(),
    ])

    const backup = {
      version: '1.0',
      createdAt: new Date().toISOString(),
      data: {
        users,
        rooms,
        guests,
        bookings,
        transactions,
        settings,
      },
    }

    return { success: true, data: backup }
  } catch (error) {
    console.error('Backup error:', error)
    return { error: 'Terjadi kesalahan saat backup' }
  }
}

export async function restoreData(backup: any) {
  try {
    if (!backup?.data) {
      return { error: 'Format backup tidak valid' }
    }

    const { users, rooms, guests, bookings, transactions, settings } = backup.data

    // Restore in order (respecting foreign keys)
    if (rooms && Array.isArray(rooms)) {
      for (const room of rooms) {
        await prisma.room.upsert({
          where: { id: room.id },
          update: room,
          create: room,
        })
      }
    }

    if (guests && Array.isArray(guests)) {
      for (const guest of guests) {
        await prisma.guest.upsert({
          where: { id: guest.id },
          update: guest,
          create: guest,
        })
      }
    }

    if (users && Array.isArray(users)) {
      for (const user of users) {
        await prisma.user.upsert({
          where: { id: user.id },
          update: user,
          create: user,
        })
      }
    }

    if (bookings && Array.isArray(bookings)) {
      for (const booking of bookings) {
        await prisma.booking.upsert({
          where: { id: booking.id },
          update: booking,
          create: booking,
        })
      }
    }

    if (transactions && Array.isArray(transactions)) {
      for (const transaction of transactions) {
        await prisma.transaction.upsert({
          where: { id: transaction.id },
          update: transaction,
          create: transaction,
        })
      }
    }

    if (settings && Array.isArray(settings)) {
      for (const setting of settings) {
        await prisma.settings.upsert({
          where: { id: setting.id },
          update: setting,
          create: setting,
        })
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Restore error:', error)
    return { error: 'Terjadi kesalahan saat restore' }
  }
}
