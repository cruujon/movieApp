'use client';

import { useState, useEffect } from 'react';

const LOCAL_STORAGE_KEY = 'watchLaterMovies';

export interface WatchLaterMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average: number;
  addedAt: number; // 追加日時（タイムスタンプ）
}

export function useWatchLater() {
  const [watchLaterMovies, setWatchLaterMovies] = useState<Record<number, WatchLaterMovie>>({});
  const [isLoading, setIsLoading] = useState(true);

  // LocalStorageからデータを読み込み
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setWatchLaterMovies(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load watch later movies:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 映画を追加
  const addToWatchLater = (movie: Omit<WatchLaterMovie, 'addedAt'>) => {
    const newMovie: WatchLaterMovie = {
      ...movie,
      addedAt: Date.now(),
    };
    
    const updated = {
      ...watchLaterMovies,
      [movie.id]: newMovie,
    };
    
    setWatchLaterMovies(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  // 映画を削除
  const removeFromWatchLater = (movieId: number) => {
    const updated = { ...watchLaterMovies };
    delete updated[movieId];
    
    setWatchLaterMovies(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  // 映画がお気に入りに含まれているかチェック
  const isInWatchLater = (movieId: number) => {
    return !!watchLaterMovies[movieId];
  };

  // お気に入り映画のリストを取得（追加日時の降順）
  const getWatchLaterList = (): WatchLaterMovie[] => {
    return Object.values(watchLaterMovies).sort((a, b) => b.addedAt - a.addedAt);
  };

  // お気に入り映画の数を取得
  const getWatchLaterCount = () => {
    return Object.keys(watchLaterMovies).length;
  };

  return {
    watchLaterMovies,
    isLoading,
    addToWatchLater,
    removeFromWatchLater,
    isInWatchLater,
    getWatchLaterList,
    getWatchLaterCount,
  };
}
