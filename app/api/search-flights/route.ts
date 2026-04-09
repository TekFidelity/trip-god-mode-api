import { NextRequest, NextResponse } from 'next/server'
import { Duffel } from '@duffel/api'

const token = process.env.DUFFEL_ACCESS_TOKEN

if (!token) {
  throw new Error('Missing DUFFEL_ACCESS_TOKEN')
}

const duffel = new Duffel({ token })

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const origin = searchParams.get('origin')
  const destination = searchParams.get('destination')
  const departureDate = searchParams.get('departure_date')
  const returnDate = searchParams.get('return_date')
  const adults = Number(searchParams.get('adults') || '1')
  const cabinClass = searchParams.get('cabin_class') || 'economy'
  const maxResults = Number(searchParams.get('max_results') || '10')

  if (!origin || !destination || !departureDate) {
    return NextResponse.json(
      { error: 'origin, destination, and departure_date are required' },
      { status: 400 }
    )
  }

  try {
    const slices = [
      {
        origin,
        destination,
        departure_date: departureDate
      }
    ]

    if (returnDate) {
      slices.push({
        origin: destination,
        destination: origin,
        departure_date: returnDate
      })
    }

    const offerRequest = await duffel.offerRequests.create({
      slices,
      passengers: Array.from({ length: adults }).map(() => ({ type: 'adult' })),
      cabin_class: cabinClass as 'economy' | 'premium_economy' | 'business' | 'first',
      return_offers: true
    })

    const offers = offerRequest.data.offers ?? []

    const results = offers.slice(0, maxResults).map((offer: any) => {
      const firstSlice = offer.slices?.[0]
      const firstSegment = firstSlice?.segments?.[0]
      const lastSegment = firstSlice?.segments?.[firstSlice.segments.length - 1]

      return {
        origin,
        destination,
        price_total: Number(offer.total_amount),
        currency: offer.total_currency,
        airline: firstSegment?.operating_carrier?.name || firstSegment?.marketing_carrier?.name || 'Unknown airline',
        stops: Math.max((firstSlice?.segments?.length || 1) - 1, 0),
        duration_minutes: firstSlice?.duration ? isoDurationToMinutes(firstSlice.duration) : null,
        departure_time: firstSegment?.departing_at || null,
        arrival_time: lastSegment?.arriving_at || null,
        cabin_class: cabinClass,
        adults,
        booking_url: null,
        offer_id: offer.id
      }
    })

    return NextResponse.json({
      results,
      meta: {
        live_data: true,
        provider: 'duffel',
        mode: token.startsWith('duffel_test_') ? 'test' : 'live'
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Duffel search failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function isoDurationToMinutes(duration: string): number | null {
  const match =
    duration.match(/P(?:\d+D)?T(?:(\d+)H)?(?:(\d+)M)?/) ||
    duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return null
  const hours = Number(match[1] || 0)
  const minutes = Number(match[2] || 0)
  return hours * 60 + minutes
}