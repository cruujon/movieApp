'use client';

import { useState, useEffect, useCallback } from 'react';
import { searchMoviesClient } from '@/lib/tmdb-client';
import type { Movie, MovieList } from '@/types';

export function useInfiniteSearch(query: string) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 検索クエリが変更された時の初期化
  useEffect(() => {
    if (query.trim()) {
      setMovies([]);
      setCurrentPage(1);
      setTotalPages(1);
      setError(null);
    }
  }, [query]);

  // 初期検索データの読み込み
  const loadInitialSearch = useCallback(async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Searching for:', query);
      let data = await searchMoviesClient(query, "ja-JP", 1);
      console.log('Search results (ja-JP):', data);
      
      // 日本語で結果が見つからない場合、英語でも検索を試す
      if (data.results.length === 0 && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(query)) {
        console.log('No results in Japanese, trying English search...');
        data = await searchMoviesClient(query, "en-US", 1);
        console.log('Search results (en-US):', data);
      }
      
      setMovies(data.results);
      setCurrentPage(1);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError('検索に失敗しました');
      console.error('Failed to search movies:', err);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  // 追加検索データの読み込み
  const loadMoreSearchResults = useCallback(async () => {
    if (!query.trim() || isLoadingMore || currentPage >= totalPages) return;
    
    setIsLoadingMore(true);
    setError(null);
    
    try {
      const nextPage = currentPage + 1;
      let data = await searchMoviesClient(query, "ja-JP", nextPage);
      
      // 日本語で結果が見つからない場合、英語でも検索を試す
      if (data.results.length === 0 && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(query)) {
        data = await searchMoviesClient(query, "en-US", nextPage);
      }
      
      setMovies(prev => [...prev, ...data.results]);
      setCurrentPage(nextPage);
    } catch (err) {
      setError('追加の検索結果の取得に失敗しました');
      console.error('Failed to load more search results:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [query, currentPage, totalPages, isLoadingMore]);

  // 初期検索の実行
  useEffect(() => {
    if (query.trim()) {
      loadInitialSearch();
    }
  }, [loadInitialSearch]);

  // スクロールイベントの監視
  useEffect(() => {
    if (!query.trim()) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      
      // ページの下部から200px以内に到達したら追加読み込み
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        loadMoreSearchResults();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreSearchResults, query]);

  const hasMore = currentPage < totalPages;

  return {
    movies,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    currentPage,
    totalPages,
    loadMoreSearchResults,
    retry: loadInitialSearch,
  };
}
