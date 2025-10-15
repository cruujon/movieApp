'use client'

import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useWatchLater } from '@/hooks/useWatchLater'
import type { Movie } from '@/types'

interface WatchLaterToggleProps {
  movie: Movie
  className?: string
}

export default function WatchLaterToggle({ movie, className = "" }: WatchLaterToggleProps) {
  const { isInWatchLater, addToWatchLater, removeFromWatchLater } = useWatchLater()
  
  const isWatched = isInWatchLater(movie.id)

  const toggleWatchLater = () => {
    if (isWatched) {
      removeFromWatchLater(movie.id)
    } else {
      addToWatchLater({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
      })
    }
    
    // カスタムイベントを発火してヘッダーのバッジを更新
    window.dispatchEvent(new CustomEvent('watchLaterChanged'))
  }

  return (
    <button
      onClick={toggleWatchLater}
      className={`p-2 rounded-full transition-colors ${
        isWatched 
          ? 'bg-blue-500 text-white hover:bg-blue-600' 
          : 'bg-white/80 text-gray-600 hover:bg-white hover:text-blue-500'
      } ${className}`}
      aria-pressed={isWatched}
      aria-label={isWatched ? '後で見るから削除' : '後で見るに追加'}
    >
      {isWatched ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
    </button>
  )
}
