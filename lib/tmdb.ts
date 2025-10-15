// lib/tmdb.ts
import type { Movie, MovieList, MovieDetail, WatchProviders } from '@/types'

/** TMDB APIプロキシ経由でデータを取得 */
export async function tmdb<T>(path: string, qs: Record<string, string | number> = {}): Promise<T> {
  const queryString = new URLSearchParams(qs as Record<string, string>).toString()
  const url = `/api/tmdb?path=${encodeURIComponent(path)}&qs=${queryString}`
  
  const res = await fetch(url, { 
    cache: 'no-store',
    headers: {
      'Accept': 'application/json',
    }
  })
  
  if (!res.ok) {
    throw new Error(`TMDB fetch failed: ${res.status}`)
  }
  
  return res.json() as Promise<T>
}

/** 人気映画を取得（サーバー専用） */
export async function fetchPopularMovies(lang = "ja-JP", page = 1): Promise<MovieList> {
  const baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'
  const apiKey = process.env.TMDB_API_KEY
  
  if (!apiKey) {
    throw new Error('TMDB_API_KEY is not configured')
  }

  const url = `${baseUrl}/movie/popular?api_key=${apiKey}&language=${lang}&page=${page}`
  
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
    next: { revalidate: 300 }, // 5分キャッシュ
  })
  
  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status}`)
  }
  
  return res.json() as Promise<MovieList>
}

/** 映画を検索 */
export async function searchMovies(query: string, lang = "ja-JP", page = 1): Promise<MovieList> {
  return tmdb<MovieList>('/search/movie', { 
    query, 
    language: lang, 
    page,
    include_adult: false 
  })
}

/** 映画詳細を取得（サーバー専用） */
export async function fetchMovieDetail(id: number, lang = "ja-JP"): Promise<MovieDetail> {
  const baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'
  const apiKey = process.env.TMDB_API_KEY
  
  if (!apiKey) {
    throw new Error('TMDB_API_KEY is not configured')
  }

  const url = `${baseUrl}/movie/${id}?api_key=${apiKey}&language=${lang}&append_to_response=credits`
  
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
    next: { revalidate: 300 }, // 5分キャッシュ
  })
  
  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status}`)
  }
  
  return res.json() as Promise<MovieDetail>
}

/** 視聴可能プラットフォームを取得 */
export async function fetchWatchProviders(id: number): Promise<WatchProviders> {
  return tmdb<WatchProviders>(`/movie/${id}/watch/providers`)
}