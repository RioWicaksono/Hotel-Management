'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateHotelSettings } from '@/actions/settings'
import { Hotel, MapPin, Phone, Mail, Save } from 'lucide-react'

interface HotelSettingsProps {
  settings: {
    id: string
    hotelName: string
    hotelAddress: string | null
    hotelPhone: string | null
    hotelEmail: string | null
  } | null
}

export function HotelSettings({ settings }: HotelSettingsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    hotelName: settings?.hotelName || '',
    hotelAddress: settings?.hotelAddress || '',
    hotelPhone: settings?.hotelPhone || '',
    hotelEmail: settings?.hotelEmail || '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await updateHotelSettings(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Pengaturan hotel berhasil disimpan')
        router.refresh()
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hotelName" className="flex items-center gap-2">
            <Hotel className="h-4 w-4" />
            Nama Hotel
          </Label>
          <Input
            id="hotelName"
            value={formData.hotelName}
            onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
            placeholder="Nama Hotel Anda"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hotelPhone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Telepon
          </Label>
          <Input
            id="hotelPhone"
            value={formData.hotelPhone}
            onChange={(e) => setFormData({ ...formData, hotelPhone: e.target.value })}
            placeholder="081234567890"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hotelEmail" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input
            id="hotelEmail"
            type="email"
            value={formData.hotelEmail}
            onChange={(e) => setFormData({ ...formData, hotelEmail: e.target.value })}
            placeholder="info@hotel.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hotelAddress" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Alamat
          </Label>
          <Input
            id="hotelAddress"
            value={formData.hotelAddress}
            onChange={(e) => setFormData({ ...formData, hotelAddress: e.target.value })}
            placeholder="Jl. Jalan No. 1"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </Button>
      </div>
    </form>
  )
}
