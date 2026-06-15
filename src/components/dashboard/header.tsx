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
    <header className="flex h-14 items-center justify-between border-b bg-card px-4 gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="hidden md:block min-w-0">
          <h1 className="text-base font-semibold text-foreground truncate">
            {hotelName || 'Dashboard'}
          </h1>
          <p className="text-xs text-muted-foreground">
            {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
          </p>
        </div>
        <div className="flex-1 max-w-md">
          <GlobalSearch />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user.name || 'User'}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            {(user.name || 'U').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
