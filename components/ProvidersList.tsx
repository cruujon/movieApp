'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { fetchWatchProvidersClient } from '@/lib/tmdb-client'
import type { WatchProviders } from '@/types'

interface ProvidersListProps {
  movieId: number
}

export default function ProvidersList({ movieId }: ProvidersListProps) {
  const [providers, setProviders] = useState<WatchProviders | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoading(true)
        const data = await fetchWatchProvidersClient(movieId)
        setProviders(data)
      } catch (err) {
        setError('視聴可能プラットフォームの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    loadProviders()
  }, [movieId])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        視聴可能プラットフォームを確認中...
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500 text-sm">{error}</p>
  }

  const jpProviders = providers?.results?.JP?.flatrate || []

  if (jpProviders.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        現在、日本での視聴可能プラットフォームはありません
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">この映画を見る</h3>
      <div className="flex flex-wrap gap-3">
        {jpProviders.map((provider) => (
          <a
            key={provider.provider_id}
            href={providers?.results?.JP?.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {provider.logo_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                alt={provider.provider_name}
                width={24}
                height={24}
                className="rounded"
              />
            )}
            <span className="text-sm font-medium text-gray-700">
              {provider.provider_name}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
