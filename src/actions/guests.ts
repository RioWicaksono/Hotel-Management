'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const GuestSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  phone: z.string().min(1, 'Nomor telepon wajib diisi'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  address: z.string().optional(),
  idCard: z.string().optional(),
  notes: z.string().optional(),
  isLoyal: z.boolean().optional(),
})

export async function createGuest(data: z.infer<typeof GuestSchema>) {
  try {
    const validation = GuestSchema.safeParse(data)
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    const guest = await prisma.guest.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        address: data.address || null,
        idCard: data.idCard || null,
        notes: data.notes || null,
        isLoyal: data.isLoyal || false,
      },
    })

    revalidatePath('/guests')
    return { success: true, guestId: guest.id }
  } catch (error) {
    console.error('Create guest error:', error)
    return { error: 'Terjadi kesalahan saat membuat tamu' }
  }
}

export async function updateGuest(id: string, data: z.infer<typeof GuestSchema>) {
  try {
    const validation = GuestSchema.safeParse(data)
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    await prisma.guest.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        address: data.address || null,
        idCard: data.idCard || null,
        notes: data.notes || null,
        isLoyal: data.isLoyal,
      },
    })

    revalidatePath('/guests')
    return { success: true }
  } catch (error) {
    console.error('Update guest error:', error)
    return { error: 'Terjadi kesalahan saat memperbarui tamu' }
  }
}

export async function toggleLoyalGuest(id: string) {
  try {
    const guest = await prisma.guest.findUnique({ where: { id } })
    if (!guest) {
      return { error: 'Tamu tidak ditemukan' }
    }

    await prisma.guest.update({
      where: { id },
      data: { isLoyal: !guest.isLoyal },
    })

    revalidatePath('/guests')
    return { success: true }
  } catch (error) {
    console.error('Toggle loyal error:', error)
    return { error: 'Terjadi kesalahan' }
  }
}

export async function deleteGuest(id: string) {
  try {
    const bookings = await prisma.booking.findFirst({
      where: { guestId: id },
    })

    if (bookings) {
      return { error: 'Tamu tidak bisa dihapus karena masih memiliki booking' }
    }

    await prisma.guest.delete({ where: { id } })
    revalidatePath('/guests')
    return { success: true }
  } catch (error) {
    console.error('Delete guest error:', error)
    return { error: 'Terjadi kesalahan saat menghapus tamu' }
  }
}
