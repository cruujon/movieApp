import type { Movie, MovieList, MovieDetail, WatchProviders } from '@/types'

/** クライアントサイド用TMDB API関数 */
export async function tmdbClient<T>(path: string, qs: Record<string, string | number | boolean> = {}): Promise<T> {
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
  
  const data = await res.json() as T;
  return data;
}

/** 人気映画を取得（クライアント用） */
export async function fetchPopularMoviesClient(lang = "ja-JP", page = 1): Promise<MovieList> {
  return tmdbClient<MovieList>('/movie/popular', { language: lang, page })
}

/** 映画を検索（クライアント用） */
export async function searchMoviesClient(query: string, lang = "ja-JP", page = 1): Promise<MovieList> {
  const result = await tmdbClient<MovieList>('/search/movie', { 
    query, 
    language: lang, 
    page,
    include_adult: false 
  });
  return result;
}

/** 映画詳細を取得（クライアント用） */
export async function fetchMovieDetailClient(id: number, lang = "ja-JP"): Promise<MovieDetail> {
  return tmdbClient<MovieDetail>(`/movie/${id}`, { 
    language: lang,
    append_to_response: 'credits'
  })
}

/** 視聴可能プラットフォームを取得（クライアント用） */
export async function fetchWatchProvidersClient(id: number): Promise<WatchProviders> {
  return tmdbClient<WatchProviders>(`/movie/${id}/watch/providers`)
}
