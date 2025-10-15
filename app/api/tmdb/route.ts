import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path') // 例: /movie/popular
  const qs = searchParams.get('qs') || '' // 例: language=ja-JP&page=1
  
  if (!path) {
    return NextResponse.json({ error: 'missing path' }, { status: 400 })
  }

  const baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'
  const apiKey = process.env.TMDB_API_KEY
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const url = `${baseUrl}${path}?api_key=${apiKey}&${qs}`
  
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // 5分キャッシュ
    })
    
    if (!res.ok) {
      throw new Error(`TMDB API error: ${res.status}`)
    }
    
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('TMDB API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from TMDB API' }, 
      { status: 500 }
    )
  }
}
