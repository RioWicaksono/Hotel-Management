import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Simple in-memory rate limiter
const rateLimit = new Map()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 60 // 60 requests per minute

function getRateLimitKey(ip: string): string {
  return `rate_limit:${ip}`
}

function isRateLimited(ip: string): boolean {
  const key = getRateLimitKey(ip)
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW

  // Clean old entries
  const timestamps = rateLimit.get(key) || []
  const validTimestamps = timestamps.filter((t: number) => t > windowStart)

  if (validTimestamps.length >= MAX_REQUESTS) {
    return true
  }

  validTimestamps.push(now)
  rateLimit.set(key, validTimestamps)
  return false
}

export async function withRateLimit(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan. Coba lagi nanti.' },
      { status: 429 }
    )
  }

  return null
}

export async function withErrorHandling(handler: () => Promise<Response>): Promise<Response> {
  try {
    return await handler()
  } catch (error) {
    console.error('API Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}

export { prisma }
