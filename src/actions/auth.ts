'use server'

import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const RegisterSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export async function registerUser(data: z.infer<typeof RegisterSchema>) {
  try {
    const validation = RegisterSchema.safeParse(data)

    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return { error: 'Email sudah terdaftar' }
    }

    const hashedPassword = await hash(data.password, 12)

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Register error:', error)
    return { error: 'Terjadi kesalahan saat registrasi' }
  }
}
