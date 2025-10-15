'use client';

import Link from 'next/link';
import { useWatchLater } from '@/hooks/useWatchLater';
import { BookmarkCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const { getWatchLaterCount } = useWatchLater();
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getWatchLaterCount());
    
    // カスタムイベントをリッスンしてバッジを更新
    const handleWatchLaterChange = () => {
      setCount(getWatchLaterCount());
    };
    
    window.addEventListener('watchLaterChanged', handleWatchLaterChange);
    
    return () => {
      window.removeEventListener('watchLaterChanged', handleWatchLaterChange);
    };
  }, [getWatchLaterCount]);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            映画紹介アプリ
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ホーム
            </Link>
            <Link 
              href="/watch-later" 
              className="relative text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
            >
              <BookmarkCheck className="w-5 h-5" />
              お気に入り
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
