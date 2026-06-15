'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const BookingSchema = z.object({
  roomId: z.string().min(1, 'Kamar wajib dipilih'),
  guestId: z.string().min(1, 'Tamu wajib dipilih'),
  checkIn: z.string().min(1, 'Check-in wajib diisi'),
  checkOut: z.string().min(1, 'Check-out wajib diisi'),
  source: z.enum(['DIRECT', 'WALK_IN', 'BOOKING', 'REDDOORZ']),
  paymentStatus: z.enum(['UNPAID', 'DP', 'PAID']),
  totalAmount: z.number().positive('Total harus positif'),
  paidAmount: z.number().min(0).default(0),
  notes: z.string().optional(),
})

export async function createBooking(data: z.infer<typeof BookingSchema>) {
  try {
    const validation = BookingSchema.safeParse(data)
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    const checkInDate = new Date(data.checkIn)
    const checkOutDate = new Date(data.checkOut)

    if (checkOutDate <= checkInDate) {
      return { error: 'Check-out harus setelah check-in' }
    }

    const overlapping = await prisma.booking.findFirst({
      where: {
        roomId: data.roomId,
        OR: [
          { checkIn: { lt: checkOutDate }, checkOut: { gt: checkInDate } },
        ],
      },
    })

    if (overlapping) {
      return { error: 'Kamar sudah booked di tanggal tersebut' }
    }

    const booking = await prisma.booking.create({
      data: {
        roomId: data.roomId,
        guestId: data.guestId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        source: data.source,
        paymentStatus: data.paymentStatus,
        totalAmount: data.totalAmount,
        paidAmount: data.paidAmount,
        notes: data.notes,
      },
    })

    if (data.paymentStatus === 'PAID' || data.paidAmount > 0) {
      await prisma.transaction.create({
        data: {
          type: 'INCOME',
          category: 'ROOM_INCOME',
          amount: data.paidAmount > 0 ? data.paidAmount : data.totalAmount,
          description: `Pembayaran booking kamar`,
          date: new Date(),
          bookingId: booking.id,
        },
      })
    }

    if (data.paymentStatus === 'PAID') {
      await prisma.room.update({
        where: { id: data.roomId },
        data: { status: 'OCCUPIED' },
      })
    }

    revalidatePath('/bookings')
    revalidatePath('/rooms')
    return { success: true }
  } catch (error) {
    console.error('Create booking error:', error)
    return { error: 'Terjadi kesalahan saat membuat booking' }
  }
}

export async function updateBooking(id: string, data: z.infer<typeof BookingSchema>) {
  try {
    const validation = BookingSchema.safeParse(data)
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    const checkInDate = new Date(data.checkIn)
    const checkOutDate = new Date(data.checkOut)

    if (checkOutDate <= checkInDate) {
      return { error: 'Check-out harus setelah check-in' }
    }

    const existingBooking = await prisma.booking.findUnique({ where: { id } })
    if (!existingBooking) {
      return { error: 'Booking tidak ditemukan' }
    }

    await prisma.booking.update({
      where: { id },
      data: {
        roomId: data.roomId,
        guestId: data.guestId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        source: data.source,
        paymentStatus: data.paymentStatus,
        totalAmount: data.totalAmount,
        paidAmount: data.paidAmount,
        notes: data.notes,
      },
    })

    revalidatePath('/bookings')
    revalidatePath('/rooms')
    return { success: true }
  } catch (error) {
    console.error('Update booking error:', error)
    return { error: 'Terjadi kesalahan saat memperbarui booking' }
  }
}

export async function deleteBooking(id: string) {
  try {
    const booking = await prisma.booking.findUnique({ where: { id } })
    if (!booking) {
      return { error: 'Booking tidak ditemukan' }
    }

    await prisma.transaction.deleteMany({ where: { bookingId: id } })
    await prisma.booking.delete({ where: { id } })

    revalidatePath('/bookings')
    revalidatePath('/rooms')
    return { success: true }
  } catch (error) {
    console.error('Delete booking error:', error)
    return { error: 'Terjadi kesalahan saat menghapus booking' }
  }
}
