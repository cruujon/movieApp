'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchPopularMoviesClient } from '@/lib/tmdb-client';
import type { Movie, MovieList } from '@/types';

export function useInfiniteScroll() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初期データの読み込み
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchPopularMoviesClient("ja-JP", 1);
      setMovies(data.results);
      setCurrentPage(1);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError('映画データの取得に失敗しました');
      console.error('Failed to load initial movies:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 追加データの読み込み
  const loadMoreMovies = useCallback(async () => {
    if (isLoadingMore || currentPage >= totalPages) return;
    
    setIsLoadingMore(true);
    setError(null);
    
    try {
      const nextPage = currentPage + 1;
      const data = await fetchPopularMoviesClient("ja-JP", nextPage);
      
      setMovies(prev => [...prev, ...data.results]);
      setCurrentPage(nextPage);
    } catch (err) {
      setError('追加の映画データの取得に失敗しました');
      console.error('Failed to load more movies:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, totalPages, isLoadingMore]);

  // 初期データの読み込み
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // スクロールイベントの監視
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      
      // ページの下部から200px以内に到達したら追加読み込み
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        loadMoreMovies();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreMovies]);

  const hasMore = currentPage < totalPages;

  return {
    movies,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    currentPage,
    totalPages,
    loadMoreMovies,
    retry: loadInitialData,
  };
}
