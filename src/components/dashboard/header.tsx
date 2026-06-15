import { ThemeToggle } from './theme-toggle'
import { GlobalSearch } from '@/components/search/global-search'

interface DashboardHeaderProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
  hotelName?: string
}

export function DashboardHeader({ user, hotelName }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur px-4 gap-4">
      {/* Left section - Hotel name */}
      <div className="flex flex-1 min-w-0">
        <h1 className="text-base font-semibold truncate">
          {hotelName || 'Dashboard'}
        </h1>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md">
        <GlobalSearch />
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-medium">{user.name || 'User'}</p>
            <p className="text-xs text-muted-foreground">
              {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-violet-500 text-white text-sm font-semibold">
            {(user.name || 'U').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
