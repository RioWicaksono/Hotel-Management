import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Super Admin
  const superAdminPassword = await hash('SA#123', 12)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'SA' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'SA',
      password: superAdminPassword,
      role: 'SUPER_ADMIN',
    },
  })
  console.log('✅ Created Super Admin:', superAdmin.email)

  // Create Admin
  const adminPassword = await hash('Admin#123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      email: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Created Admin:', admin.email)

  // Create Rooms
  const rooms = [
    { roomNumber: '101', type: 'Standard', price: 150000, status: 'AVAILABLE' as const },
    { roomNumber: '102', type: 'Standard', price: 150000, status: 'AVAILABLE' as const },
    { roomNumber: '103', type: 'Deluxe', price: 200000, status: 'AVAILABLE' as const },
    { roomNumber: '104', type: 'Deluxe', price: 200000, status: 'AVAILABLE' as const },
    { roomNumber: '105', type: 'Standard', price: 150000, status: 'AVAILABLE' as const },
    { roomNumber: '106', type: 'Superior', price: 175000, status: 'AVAILABLE' as const },
    { roomNumber: '107', type: 'Superior', price: 175000, status: 'AVAILABLE' as const },
  ]

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { roomNumber: room.roomNumber },
      update: {},
      create: room,
    })
  }
  console.log('✅ Created', rooms.length, 'rooms')

  // Create Sample Guests
  const guests = [
    { name: 'Budi Santoso', phone: '081234567890', email: 'budi@email.com' },
    { name: 'Ani Wijaya', phone: '081234567891', email: 'ani@email.com' },
    { name: 'Dewi Lestari', phone: '081234567892', email: 'dewi@email.com' },
  ]

  for (const guest of guests) {
    await prisma.guest.upsert({
      where: { phone: guest.phone },
      update: {},
      create: guest,
    })
  }
  console.log('✅ Created', guests.length, 'sample guests')

  // Create Hotel Settings
  const settings = await prisma.settings.upsert({
    where: { id: 'hotel_settings' },
    update: {},
    create: {
      id: 'hotel_settings',
      hotelName: 'Losmen Sejahtera',
      hotelAddress: 'Jl. Jalan No. 1, Kota',
      hotelPhone: '081234567890',
      hotelEmail: 'info@losmensejahtera.com',
    },
  })
  console.log('✅ Created Hotel Settings:', settings.hotelName)

  console.log('🎉 Seeding completed!')
  console.log('')
  console.log('📋 Login Credentials:')
  console.log('   Super Admin: SA / SA#123')
  console.log('   Admin: Admin / Admin#123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
