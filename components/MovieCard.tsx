import Image from 'next/image'
import Link from 'next/link'
import type { Movie } from '@/types'
import Rating from './Rating'
import WatchLaterToggle from './WatchLaterToggle'

interface MovieCardProps {
  movie: Movie
  critic?: string
}

export default function MovieCard({ movie, critic }: MovieCardProps) {
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
      <Link href={`/movie/${movie.id}`} className="block">
        {/* ポスター画像 */}
        <div className="relative aspect-[2/3] bg-gray-200">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${movie.title} のポスター`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span className="text-sm">No Image</span>
            </div>
          )}
          
          {/* 後で見るトグル（右上） */}
          <div className="absolute top-2 right-2">
            <WatchLaterToggle movie={movie} />
          </div>
        </div>
        
        {/* 映画情報 */}
        <div className="p-4">
          {/* タイトル */}
          <h2 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-900" title={movie.title}>
            {movie.title}
          </h2>
          
          {/* 評価 */}
          <div className="mb-2">
            <Rating value={movie.vote_average} />
          </div>
          
          {/* 公開日 */}
          {movie.release_date && (
            <p className="text-sm text-gray-600 mb-2">
              {new Date(movie.release_date).getFullYear()}
            </p>
          )}
          
          {/* 専門家の一言 */}
          {critic && (
            <p className="text-sm text-gray-500 italic line-clamp-2">
              "{critic}"
            </p>
          )}
        </div>
      </Link>
    </div>
  )
}
