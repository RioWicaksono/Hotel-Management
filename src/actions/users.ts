'use server'

import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const CreateUserSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.enum(['ADMIN', 'SUPER_ADMIN']),
})

const UpdateUserSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter').optional(),
  role: z.enum(['ADMIN', 'SUPER_ADMIN']),
})

export async function createUser(data: z.infer<typeof CreateUserSchema>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'SUPER_ADMIN') {
      return { error: 'Hanya Super Admin yang dapat membuat user' }
    }

    const validation = CreateUserSchema.safeParse(data)
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
        role: data.role,
      },
    })

    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Create user error:', error)
    return { error: 'Terjadi kesalahan saat membuat user' }
  }
}

export async function updateUser(id: string, data: z.infer<typeof UpdateUserSchema>) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'SUPER_ADMIN') {
      return { error: 'Hanya Super Admin yang dapat mengubah user' }
    }

    const validation = UpdateUserSchema.safeParse(data)
    if (!validation.success) {
      return { error: validation.error.errors[0].message }
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: data.email, NOT: { id } },
    })

    if (existingUser) {
      return { error: 'Email sudah terdaftar' }
    }

    const updateData: any = {
      name: data.name,
      email: data.email,
      role: data.role,
    }

    if (data.password) {
      updateData.password = await hash(data.password, 12)
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    })

    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Update user error:', error)
    return { error: 'Terjadi kesalahan saat memperbarui user' }
  }
}

export async function deleteUser(id: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as { role: string }).role !== 'SUPER_ADMIN') {
      return { error: 'Hanya Super Admin yang dapat menghapus user' }
    }

    const userToDelete = await prisma.user.findUnique({ where: { id } })
    if (!userToDelete) {
      return { error: 'User tidak ditemukan' }
    }

    if (userToDelete.role === 'SUPER_ADMIN') {
      const superAdminCount = await prisma.user.count({
        where: { role: 'SUPER_ADMIN' },
      })
      if (superAdminCount <= 1) {
        return { error: 'Tidak dapat menghapus Super Admin terakhir' }
      }
    }

    await prisma.user.delete({ where: { id } })
    revalidatePath('/settings')
    return { success: true }
  } catch (error) {
    console.error('Delete user error:', error)
    return { error: 'Terjadi kesalahan saat menghapus user' }
  }
}
