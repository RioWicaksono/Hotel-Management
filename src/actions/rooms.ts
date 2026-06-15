'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const RoomSchema = z.object({
  roomNumber: z.string().min(1, 'Nomor kamar wajib diisi'),
  type: z.string().min(1, 'Tipe kamar wajib diisi'),
  price: z.number().positive('Harga harus positif'),
  weekendPrice: z.number().positive().nullable().optional(),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'CLEANING', 'MAINTENANCE']),
  description: z.string().optional(),
})

const UpdateStatusSchema = z.object({
  roomId: z.string().min(1),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'CLEANING', 'MAINTENANCE']),
})

export async function createRoom(data: z.infer<typeof RoomSchema>) {
  try {
    const validation = RoomSchema.safeParse(data)
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    const existingRoom = await prisma.room.findUnique({
      where: { roomNumber: data.roomNumber },
    })

    if (existingRoom) {
      return { error: 'Nomor kamar sudah ada' }
    }

    await prisma.room.create({
      data: {
        roomNumber: data.roomNumber,
        type: data.type,
        price: data.price,
        weekendPrice: data.weekendPrice,
        status: data.status,
        description: data.description,
      },
    })

    revalidatePath('/rooms')
    return { success: true }
  } catch (error) {
    console.error('Create room error:', error)
    return { error: 'Terjadi kesalahan saat membuat kamar' }
  }
}

export async function updateRoom(id: string, data: z.infer<typeof RoomSchema>) {
  try {
    const validation = RoomSchema.safeParse(data)
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    const existingRoom = await prisma.room.findFirst({
      where: { roomNumber: data.roomNumber, NOT: { id } },
    })

    if (existingRoom) {
      return { error: 'Nomor kamar sudah ada' }
    }

    await prisma.room.update({
      where: { id },
      data: {
        roomNumber: data.roomNumber,
        type: data.type,
        price: data.price,
        weekendPrice: data.weekendPrice,
        status: data.status,
        description: data.description,
      },
    })

    revalidatePath('/rooms')
    return { success: true }
  } catch (error) {
    console.error('Update room error:', error)
    return { error: 'Terjadi kesalahan saat memperbarui kamar' }
  }
}

export async function deleteRoom(id: string) {
  try {
    const bookings = await prisma.booking.findFirst({
      where: { roomId: id },
    })

    if (bookings) {
      return { error: 'Kamar tidak bisa dihapus karena masih memiliki booking' }
    }

    await prisma.room.delete({ where: { id } })
    revalidatePath('/rooms')
    return { success: true }
  } catch (error) {
    console.error('Delete room error:', error)
    return { error: 'Terjadi kesalahan saat menghapus kamar' }
  }
}

export async function updateRoomStatus(data: z.infer<typeof UpdateStatusSchema>) {
  try {
    const validation = UpdateStatusSchema.safeParse(data)
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    await prisma.room.update({
      where: { id: data.roomId },
      data: { status: data.status },
    })

    revalidatePath('/rooms')
    revalidatePath('/calendar')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Update room status error:', error)
    return { error: 'Terjadi kesalahan saat update status' }
  }
}
