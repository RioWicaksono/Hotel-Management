import { RoomStatus } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export interface RoomStatusBoardProps {
  stats: {
    total: number
    available: number
    occupied: number
    cleaning: number
    maintenance: number
  }
}

export interface RoomCardProps {
  room: {
    id: string
    roomNumber: string
    type: string
    price: number | Decimal
    weekendPrice?: number | Decimal | null
    status: RoomStatus
    description: string | null
    photos?: string[]
  }
}

export interface RoomDialogProps {
  mode: 'create' | 'edit'
  room?: RoomCardProps['room']
  children?: React.ReactNode
}
