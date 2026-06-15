'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GuestDialog } from './guest-dialog'
import { GuestHistory } from './guest-history'
import { Input } from '@/components/ui/input'
import { Search, Phone, Mail, Home, Star, Filter } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface GuestListProps {
  guests: any[]
}

export function GuestList({ guests }: GuestListProps) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'loyal' | 'new'>('all')
  const [selectedGuest, setSelectedGuest] = useState<any>(null)

  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(search.toLowerCase()) ||
      guest.phone.includes(search)

    if (filter === 'loyal') return matchesSearch && guest.isLoyal
    if (filter === 'new') return matchesSearch && guest.bookings?.length === 0
    return matchesSearch
  })

  if (guests.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari tamu berdasarkan nama atau telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-1">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="gap-1"
          >
            <Filter className="h-3 w-3" />
            Semua
          </Button>
          <Button
            variant={filter === 'loyal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('loyal')}
            className="gap-1 bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30"
          >
            <Star className="h-3 w-3" />
            Langganan
          </Button>
          <Button
            variant={filter === 'new' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('new')}
          >
            Baru
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Menampilkan {filteredGuests.length} dari {guests.length} tamu
      </div>

      {/* Guest Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGuests.map((guest) => (
          <Card
            key={guest.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedGuest?.id === guest.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedGuest(selectedGuest?.id === guest.id ? null : guest)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{guest.name}</CardTitle>
                  {guest.isLoyal && (
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  )}
                </div>
                <Badge variant="outline">{guest.bookings?.length || 0}x</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {guest.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate">{guest.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{guest.phone}</span>
              </div>
              {guest.address && (
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate">{guest.address}</span>
                </div>
              )}

              {guest.lastVisit && (
                <div className="text-xs text-muted-foreground">
                  Terakhir: {formatDate(new Date(guest.lastVisit))}
                </div>
              )}

              <GuestDialog guest={guest}>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Edit & Lihat Riwayat
                </Button>
              </GuestDialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGuests.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {filter === 'loyal'
              ? 'Belum ada tamu langganan'
              : filter === 'new'
              ? 'Semua tamu sudah memiliki booking'
              : 'Tamu tidak ditemukan'}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
