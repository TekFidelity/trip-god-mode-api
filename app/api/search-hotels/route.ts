import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const city = searchParams.get('city') || 'Mexico City'
  const maxResults = Number(searchParams.get('max_results') || '5')

  const results = [
    {
      city,
      area: 'Roma Norte',
      hotel_name: 'Example Hotel',
      price_total: 240,
      currency: 'USD',
      nightly_rate: 120,
      rating: 8.7,
      review_count: 420,
      cancellation_policy: 'Flexible',
      distance_to_center_km: 1.8
    },
    {
      city,
      area: 'Condesa',
      hotel_name: 'Casa Verde Suites',
      price_total: 280,
      currency: 'USD',
      nightly_rate: 140,
      rating: 9.0,
      review_count: 315,
      cancellation_policy: 'Flexible',
      distance_to_center_km: 2.1
    },
    {
      city,
      area: 'Juarez',
      hotel_name: 'Central Stay',
      price_total: 190,
      currency: 'USD',
      nightly_rate: 95,
      rating: 8.1,
      review_count: 210,
      cancellation_policy: 'Moderate',
      distance_to_center_km: 2.5
    }
  ].slice(0, maxResults)

  return NextResponse.json({
    results,
    meta: {
      live_data: false,
      provider: 'mock'
    }
  })
}