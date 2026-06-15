'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const router = useRouter()
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Load theme from localStorage first (for fast UI)
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.remove('dark', 'light')
      document.documentElement.classList.add(savedTheme)
    } else {
      document.documentElement.classList.add('dark')
    }

    // Then sync with server
    fetchThemeFromServer()
  }, [])

  async function fetchThemeFromServer() {
    try {
      const res = await fetch('/api/settings/theme')
      if (res.ok) {
        const data = await res.json()
        if (data.darkMode) {
          setTheme(data.darkMode as 'dark' | 'light')
          localStorage.setItem('theme', data.darkMode)
          document.documentElement.classList.remove('dark', 'light')
          document.documentElement.classList.add(data.darkMode)
        }
      }
    } catch {
      // Ignore - use localStorage fallback
    }
  }

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)

    // Update localStorage
    localStorage.setItem('theme', newTheme)

    // Update DOM
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(newTheme)

    // Save to server
    try {
      await fetch('/api/settings/theme', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ darkMode: newTheme }),
      })
    } catch {
      // Ignore - localStorage is already updated
    }
  }

  if (!mounted) return null

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-8 w-8 p-0"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}
