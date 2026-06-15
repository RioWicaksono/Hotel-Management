'use client'

import { useRef } from 'react'
import { Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'

interface ReceiptProps {
  booking: {
    id: string
    checkIn: Date
    checkOut: Date
    source: string
    paymentStatus: string
    totalAmount: number
    paidAmount: number
    notes?: string | null
    room: {
      roomNumber: string
      type: string
      price: number
    }
    guest: {
      name: string
      phone: string
    }
  }
  hotelName?: string
  type: 'booking' | 'checkout' | 'invoice'
}

export function PrintReceipt({ booking, hotelName = 'Hotel', type }: ReceiptProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const nights = Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Struk ${type === 'checkout' ? 'Check-out' : 'Booking'}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; font-size: 12px; padding: 20px; max-width: 300px; margin: auto; }
          .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
          .header h1 { font-size: 16px; margin-bottom: 5px; }
          .header p { font-size: 10px; }
          .info { margin-bottom: 15px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .divider { border-top: 1px dashed #000; margin: 10px 0; }
          .total { font-weight: bold; font-size: 14px; }
          .footer { text-align: center; margin-top: 15px; font-size: 10px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${hotelName}</h1>
          <p>Struk ${type === 'checkout' ? 'Check-out' : 'Booking'}</p>
          <p>${new Date().toLocaleString('id-ID')}</p>
        </div>
        <div class="info">
          <div class="info-row"><span>No. Kamar:</span><span>${booking.room.roomNumber}</span></div>
          <div class="info-row"><span>Tipe:</span><span>${booking.room.type}</span></div>
          <div class="info-row"><span>Nama Tamu:</span><span>${booking.guest.name}</span></div>
          <div class="info-row"><span>Telepon:</span><span>${booking.guest.phone}</span></div>
        </div>
        <div class="divider"></div>
        <div class="info">
          <div class="info-row"><span>Check-in:</span><span>${formatDate(new Date(booking.checkIn))}</span></div>
          <div class="info-row"><span>Check-out:</span><span>${formatDate(new Date(booking.checkOut))}</span></div>
          <div class="info-row"><span>Lama Menginap:</span><span>${nights} malam</span></div>
          <div class="info-row"><span>Harga/Malam:</span><span>${formatCurrency(booking.room.price)}</span></div>
        </div>
        <div class="divider"></div>
        <div class="info">
          <div class="info-row"><span>Total:</span><span>${formatCurrency(booking.totalAmount)}</span></div>
          <div class="info-row"><span>Dibayar:</span><span>${formatCurrency(booking.paidAmount)}</span></div>
          <div class="info-row"><span>Status:</span><span>${booking.paymentStatus === 'PAID' ? 'LUNAS' : 'BELUM LUNAS'}</span></div>
        </div>
        ${booking.notes ? `<div class="info"><div>Catatan: ${booking.notes}</div></div>` : ''}
        <div class="footer">
          <p>Terima kasih atas kunjungan Anda</p>
          <p>Simpan struk ini sebagai bukti</p>
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
    printWindow.close()
  }

  return (
    <>
      <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
        <Printer className="h-4 w-4" />
        Cetak Struk
      </Button>

      {/* Hidden ref for data access */}
      <div ref={printRef} className="hidden" />
    </>
  )
}
