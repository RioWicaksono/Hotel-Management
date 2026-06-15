'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react'

interface RoomPhotoUploadProps {
  roomId: string
  roomNumber: string
  photos: string[]
}

export function RoomPhotoUpload({ roomId, roomNumber, photos }: RoomPhotoUploadProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  async function handleAddPhoto() {
    if (!urlInput.trim()) {
      toast.error('Masukkan URL foto')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/rooms/${roomId}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      })

      if (res.ok) {
        toast.success('Foto berhasil ditambahkan')
        setUrlInput('')
        router.refresh()
      } else {
        toast.error('Gagal menambahkan foto')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  async function handleRemovePhoto(url: string) {
    try {
      const res = await fetch(`/api/rooms/${roomId}/photos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (res.ok) {
        toast.success('Foto dihapus')
        router.refresh()
      } else {
        toast.error('Gagal menghapus foto')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Camera className="h-4 w-4" />
          Foto ({photos.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Foto Kamar {roomNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Photo Grid */}
          {photos.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {photos.map((url, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => handleRemovePhoto(url)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
              <p className="text-sm">Belum ada foto</p>
            </div>
          )}

          {/* Add Photo Form */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                onKeyDown={(e) => e.key === 'Enter' && handleAddPhoto()}
              />
              <Button onClick={handleAddPhoto} disabled={loading || !urlInput.trim()}>
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Masukkan URL foto dari internet (ImgBB, Cloudinary, dll)
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
