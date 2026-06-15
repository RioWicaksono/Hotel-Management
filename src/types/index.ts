import { UserRole, RoomStatus, BookingSource, PaymentStatus, TransactionType, TransactionCategory, Booking, Transaction } from '@prisma/client'

export type { UserRole, RoomStatus, BookingSource, PaymentStatus, TransactionType, TransactionCategory }

export interface UserSession {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface RoomWithBookings {
  id: string
  roomNumber: string
  type: string
  price: number
  status: RoomStatus
  description: string | null
  bookings: Booking[]
}

export interface GuestWithBookings {
  id: string
  name: string
  email: string | null
  phone: string
  address: string | null
  idCard: string | null
  notes: string | null
  bookings: Booking[]
}

export interface BookingWithDetails {
  id: string
  roomId: string
  guestId: string
  checkIn: Date
  checkOut: Date
  source: BookingSource
  paymentStatus: PaymentStatus
  totalAmount: number
  paidAmount: number
  notes: string | null
  room: {
    id: string
    roomNumber: string
    type: string
  }
  guest: {
    id: string
    name: string
    phone: string
  }
  transactions: Transaction[]
}

export interface TransactionWithBooking {
  id: string
  type: TransactionType
  category: TransactionCategory
  amount: number
  description: string
  date: Date
  bookingId: string | null
  booking?: {
    id: string
    guest: {
      name: string
    }
  } | null
}

export interface DashboardStats {
  totalRooms: number
  availableRooms: number
  occupiedRooms: number
  totalGuests: number
  monthlyRevenue: number
  monthlyExpense: number
  monthlyProfit: number
  occupancyRate: number
  recentBookings: BookingWithDetails[]
}

export interface DailyCashReport {
  date: Date
  openingBalance: number
  totalIncome: number
  totalExpense: number
  closingBalance: number
  transactions: TransactionWithBooking[]
}

export interface PLReport {
  startDate: Date
  endDate: Date
  totalRoomIncome: number
  totalExpense: number
  profit: number
  expensesByCategory: Record<TransactionCategory, number>
}

export interface ExportData {
  headers: string[]
  rows: (string | number)[][]
  filename: string
  sheetName: string
}
