'use client';

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { fetchMovieDetailClient } from "@/lib/tmdb-client"
import ProvidersList from "@/components/ProvidersList"
import WatchLaterToggle from "@/components/WatchLaterToggle"
import ErrorBlock from "@/components/ErrorBlock"
import Header from "@/components/Header"
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Star } from 'lucide-react'
import type { MovieDetail } from '@/types'

// 専門家の一言（静的データ）
const criticQuotes: Record<string, string> = {
  "死霊館": "恐怖の新境地を切り開く傑作ホラー",
  "The Lost Princess": "ファンタジーの世界観が圧倒的",
  "The Toxic Avenger": "アクションとコメディの絶妙なバランス",
  "ウォー・オブ・ザ・ワールド": "SF映画の金字塔",
  "鬼滅の刃": "アニメーション映画の新たな可能性",
  "悪魔祓い": "日本ホラーの新たなスタンダード",
  "プレイ・ダーティー": "スリル満点のエンターテイメント",
  "ファンタスティック４": "スーパーヒーロー映画の王道",
  "Primitive War": "迫力満点のアクション映画",
  "HIM": "心理的サスペンスの傑作",
  "第10客室の女": "ミステリーの新境地",
  "トロン": "サイバーパンクの名作",
  "箱の中の呪い": "ホラーの新たな表現",
  "Prisoner of War": "戦争映画の重厚な描写",
  "KPOPガールズ": "音楽とアクションの融合",
  "Fight Another Day": "アクション映画の王道",
  "カマキリ": "日本映画の新たな挑戦",
  "スーパーマン": "スーパーヒーローの原点",
  "ミッション": "アクション映画の最高峰"
}

function getCriticQuote(title: string): string | undefined {
  for (const [keyword, quote] of Object.entries(criticQuotes)) {
    if (title.includes(keyword)) {
      return quote
    }
  }
  return undefined
}

export default function MovieDetailPage() {
  const params = useParams()
  const movieId = parseInt(params.id as string)
  
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMovie = async () => {
      if (isNaN(movieId)) {
        setError('無効な映画IDです')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await fetchMovieDetailClient(movieId, "ja-JP")
        setMovie(data)
      } catch (err) {
        setError('映画データの取得に失敗しました')
        console.error('Failed to fetch movie detail:', err)
      } finally {
        setLoading(false)
      }
    }

    loadMovie()
  }, [movieId])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="aspect-[2/3] bg-gray-300 rounded-lg"></div>
              </div>
              <div className="lg:col-span-2">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !movie) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <ErrorBlock 
            message={error || '映画が見つかりませんでした'}
          />
        </div>
      </main>
    )
  }

  const critic = getCriticQuote(movie.title)
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null

  return (
    <main className="min-h-screen bg-gray-50">
      {/* バックドロップ */}
      {backdropUrl && (
        <div className="relative h-64 md:h-96 overflow-hidden">
          <Image
            src={backdropUrl}
            alt={`${movie.title} のバックドロップ`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      )}

      {/* ヘッダー */}
      <Header />

      {/* メインコンテンツ */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ポスター */}
          <div className="lg:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={`${movie.title} のポスター`}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                  <span className="text-sm">No Image</span>
                </div>
              )}
            </div>
          </div>

          {/* 映画情報 */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {movie.title}
                </h1>
                <WatchLaterToggle movie={movie} />
              </div>

              {/* 評価と公開日 */}
              <div className="flex items-center gap-6 mb-4">
                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-2" aria-label={`評価 ${movie.vote_average.toFixed(1)} / 10`}>
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold text-gray-800">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-sm text-gray-600">/ 10</span>
                  </div>
                )}
                {movie.release_date && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                )}
                {movie.runtime && movie.runtime > 0 && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{movie.runtime}分</span>
                  </div>
                )}
              </div>

              {movie.tagline && (
                <p className="text-lg italic text-gray-700 mb-4">
                  &quot;{movie.tagline}&quot;
                </p>
              )}

              <h2 className="text-xl font-semibold text-gray-900 mb-2">概要</h2>
              <p className="text-gray-700 mb-4">
                {movie.overview || "概要がありません。"}
              </p>

              {critic && (
                <p className="text-md italic text-blue-700 mb-4">
                  専門家の一言: &quot;{critic}&quot;
                </p>
              )}

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">ジャンル:</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span key={genre.id} className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-800">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cast (Optional) */}
              {movie.credits?.cast && movie.credits.cast.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">主要キャスト:</h3>
                  <div className="flex flex-wrap gap-4">
                    {movie.credits.cast.slice(0, 5).map((person) => (
                      <div key={person.id} className="text-center">
                        {person.profile_path && (
                          <Image
                            src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                            alt={person.name}
                            width={80}
                            height={80}
                            className="rounded-full object-cover size-20 mx-auto mb-1"
                          />
                        )}
                        <p className="text-sm font-medium text-gray-800">{person.name}</p>
                        <p className="text-xs text-gray-600">{person.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Watch Providers */}
              <ProvidersList movieId={movieId} />
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-sm text-gray-500 text-center">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </p>
        </div>
      </footer>
    </main>
  )
}