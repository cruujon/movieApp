'use client';

import { useWatchLater } from '@/hooks/useWatchLater';
import Image from 'next/image';
import Link from 'next/link';
import { BookmarkCheck, Calendar, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function WatchLaterPage() {
  const { getWatchLaterList, removeFromWatchLater, isLoading } = useWatchLater();
  const [removingId, setRemovingId] = useState<number | null>(null);
  
  const watchLaterMovies = getWatchLaterList();

  const handleRemove = async (movieId: number) => {
    setRemovingId(movieId);
    // 少し遅延を入れてUXを向上
    setTimeout(() => {
      removeFromWatchLater(movieId);
      setRemovingId(null);
    }, 200);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-[2/3] bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              映画紹介アプリ
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                ホーム
              </Link>
              <Link href="/search" className="text-gray-600 hover:text-gray-900 transition-colors">
                検索
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <BookmarkCheck className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              お気に入り映画
            </h1>
            <p className="text-gray-600">
              {watchLaterMovies.length}件の映画が保存されています
            </p>
          </div>
        </div>

        {watchLaterMovies.length === 0 ? (
          <div className="text-center py-16">
            <BookmarkCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              お気に入り映画がありません
            </h2>
            <p className="text-gray-500 mb-6">
              映画のブックマークボタンを押して、お気に入りに追加しましょう
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              映画を探す
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {watchLaterMovies.map((movie) => (
              <div 
                key={movie.id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 ${
                  removingId === movie.id ? 'opacity-50 scale-95' : ''
                }`}
              >
                <Link href={`/movie/${movie.id}`} className="block">
                  {/* ポスター画像 */}
                  <div className="relative aspect-[2/3] bg-gray-200">
                    {movie.poster_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={`${movie.title} のポスター`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                    
                    {/* 削除ボタン */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(movie.id);
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      aria-label="お気に入りから削除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* 映画情報 */}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-900" title={movie.title}>
                      {movie.title}
                    </h2>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      {/* 評価 */}
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
                      </div>
                      
                      {/* 公開日 */}
                      {movie.release_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(movie.release_date).getFullYear()}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* 追加日時 */}
                    <p className="text-xs text-gray-500">
                      追加日: {new Date(movie.addedAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
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
  );
}
