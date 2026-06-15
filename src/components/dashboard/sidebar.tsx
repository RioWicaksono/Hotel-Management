'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Bed,
  CalendarDays,
  Calendar,
  Users,
  Receipt,
  FileBarChart,
  Settings,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  BedDouble,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BedDouble },
  { name: 'Kamar', href: '/dashboard/rooms', icon: Bed },
  { name: 'Booking', href: '/dashboard/bookings', icon: Calendar },
  { name: 'Tamu', href: '/dashboard/guests', icon: Users },
  { name: 'Transaksi', href: '/dashboard/transactions', icon: Receipt },
  { name: 'Laporan', href: '/dashboard/reports', icon: FileBarChart },
  { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
]

interface DashboardSidebarProps {
  hotelName?: string
}

export function DashboardSidebar({ hotelName = 'Losmen Sejahtera' }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-violet-500 text-white shadow-lg lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card border-r transition-transform duration-300 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b p-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-violet-500">
              <Bed className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold">{hotelName}</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Logo */}
        <div className="hidden lg:flex h-14 items-center border-b px-4 bg-gradient-to-r from-pink-500/10 to-violet-500/5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-violet-500">
            <Bed className="h-4 w-4 text-white" />
          </div>
          <span className="ml-2 text-sm font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            {hotelName}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg shadow-pink-500/25'
                    : 'text-muted-foreground hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-violet-500/10 hover:text-foreground'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive ? 'text-white' : '')} />
                <span className="ml-3">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t p-2">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
