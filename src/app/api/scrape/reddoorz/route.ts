import { NextRequest, NextResponse } from 'next/server'

interface RedDoorzRoom {
  name: string
  price: number
  originalPrice?: number
  discount?: number
  amenities: string[]
  images: string[]
}

interface RedDoorzResponse {
  success: boolean
  hotelName: string
  location: string
  rating?: number
  reviewCount?: number
  rooms: RedDoorzRoom[]
  lastUpdated: string
  error?: string
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  try {
    if (!url.includes('reddoorz.com')) {
      return NextResponse.json({ error: 'Invalid RedDoorz URL' }, { status: 400 })
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    })

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Failed to fetch: ${response.status}`,
        hotelName: '',
        location: '',
        rooms: [],
        lastUpdated: new Date().toISOString(),
      }, { status: response.status })
    }

    const html = await response.text()
    const rooms: RedDoorzRoom[] = []

    // Parse hotel info
    const hotelNameMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i)
    const locationMatch = html.match(/location[^>]*>([^<]+)<\/span>/i)

    // Look for price patterns
    const pricePatterns = [
      /Rp\.?\s*([\d,.]+)\s*\/?mlm/i,
      /IDR\s*([\d,.]+)/i,
      /price["\s][^>]*>\s*([\d,.]+)/i,
    ]

    for (const pattern of pricePatterns) {
      const match = html.match(pattern)
      if (match) {
        const priceStr = match[1].replace(/[.,]/g, '')
        const price = parseInt(priceStr)
        if (price > 0) {
          rooms.push({
            name: 'Standard Room',
            price: price,
            amenities: [],
            images: [],
          })
          break
        }
      }
    }

    const result: RedDoorzResponse = {
      success: true,
      hotelName: hotelNameMatch?.[1] || 'RedDoorz Hotel',
      location: locationMatch?.[1] || 'Indonesia',
      rooms,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('RedDoorz scrape error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to scrape RedDoorz website',
      hotelName: '',
      location: '',
      rooms: [],
      lastUpdated: new Date().toISOString(),
    }, { status: 500 })
  }
}
