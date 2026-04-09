import { NextRequest, NextResponse } from 'next/server'

const API_KEY = process.env.SKYSCANNER_API_KEY
const BASE_URL = process.env.SKYSCANNER_BASE_URL || 'https://partners.api.skyscanner.net'
const DEFAULT_MARKET = process.env.DEFAULT_MARKET || 'US'
const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'en-US'
const DEFAULT_CURRENCY = process.env.DEFAULT_CURRENCY || 'USD'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const origin = searchParams.get('origin')
  const destination = searchParams.get('destination')
  const departureDate = searchParams.get('departure_date')
  const returnDate = searchParams.get('return_date')
  const adults = Number(searchParams.get('adults') || '1')
  const cabinClass = searchParams.get('cabin_class') || 'economy'
  const market = searchParams.get('market') || DEFAULT_MARKET
  const locale = searchParams.get('locale') || DEFAULT_LOCALE
  const currency = searchParams.get('currency') || DEFAULT_CURRENCY

  if (!API_KEY) {
    return NextResponse.json({ error: 'Missing SKYSCANNER_API_KEY' }, { status: 500 })
  }

  if (!origin || !destination || !departureDate) {
    return NextResponse.json(
      { error: 'origin, destination, and departure_date are required' },
      { status: 400 }
    )
  }

  try {
    // TODO:
    // 1. create Skyscanner live search session
    // 2. poll search session
    // 3. normalize results

    return NextResponse.json({
      results: [],
      meta: {
        live_data: true,
        provider: 'skyscanner',
        note: 'Skyscanner integration placeholder - create/poll flow not implemented yet',
        query: {
          origin,
          destination,
          departureDate,
          returnDate,
          adults,
          cabinClass,
          market,
          locale,
          currency
        }
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Skyscanner live search failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}