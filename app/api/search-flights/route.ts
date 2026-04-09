import { NextRequest, NextResponse } from 'next/server'

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
      {
        error: 'origin, destination, and departure_date are required'
      },
      { status: 400 }
    )
  }

  return NextResponse.json({
    results: [
      {
        origin,
        destination,
        price_total: 399,
        currency: 'USD',
        airline: 'Sample Airline',
        stops: 0,
        duration_minutes: 240,
        departure_time: `${departureDate}T09:00:00`,
        arrival_time: `${departureDate}T13:00:00`,
        booking_url: 'https://example.com/book',
        cabin_class: cabinClass,
        adults
      },
      {
        origin,
        destination,
        price_total: 455,
        currency: 'USD',
        airline: 'Sample Airline 2',
        stops: 1,
        duration_minutes: 310,
        departure_time: `${departureDate}T12:30:00`,
        arrival_time: `${departureDate}T18:40:00`,
        booking_url: 'https://example.com/book-2',
        cabin_class: cabinClass,
        adults
      }
    ].slice(0, maxResults),
    meta: {
      live_data: false,
      provider: 'mock',
      note: 'Mock response for GPT Action testing',
      return_date: returnDate
    }
  })
}