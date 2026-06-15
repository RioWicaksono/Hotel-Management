'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const SettingsSchema = z.object({
  hotelName: z.string().min(1, 'Nama hotel wajib diisi'),
  hotelAddress: z.string().optional(),
  hotelPhone: z.string().optional(),
  hotelEmail: z.string().email('Email tidak valid').optional().or(z.literal('')),
})

export async function updateHotelSettings(data: z.infer<typeof SettingsSchema>) {
  try {
    const validation = SettingsSchema.safeParse(data)
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    await prisma.settings.upsert({
      where: { id: 'hotel_settings' },
      update: {
        hotelName: data.hotelName,
        hotelAddress: data.hotelAddress || null,
        hotelPhone: data.hotelPhone || null,
        hotelEmail: data.hotelEmail || null,
      },
      create: {
        id: 'hotel_settings',
        hotelName: data.hotelName,
        hotelAddress: data.hotelAddress || null,
        hotelPhone: data.hotelPhone || null,
        hotelEmail: data.hotelEmail || null,
      },
    })

    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Update settings error:', error)
    return { error: 'Terjadi kesalahan saat menyimpan pengaturan' }
  }
}

export async function getHotelSettings() {
  return prisma.settings.findUnique({
    where: { id: 'hotel_settings' },
  })
}
