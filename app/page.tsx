'use client';

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import MovieCard from "@/components/MovieCard"
import SkeletonCard from "@/components/SkeletonCard"
import ErrorBlock from "@/components/ErrorBlock"
import LoadingIndicator from "@/components/LoadingIndicator"
import Header from "@/components/Header"

// クライアントコンポーネントのため、metadataは削除

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
  // タイトルからキーワードを抽出してマッチング
  for (const [keyword, quote] of Object.entries(criticQuotes)) {
    if (title.includes(keyword)) {
      return quote
    }
  }
  return undefined
}

export default function HomePage() {
  const { 
    movies, 
    isLoading, 
    isLoadingMore, 
    error, 
    hasMore, 
    retry 
  } = useInfiniteScroll();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              人気の映画
            </h2>
            <p className="text-gray-600">
              次に観る映画をサクッと見つけよう
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorBlock 
          message={error}
          onRetry={retry}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <Header />

      {/* メインコンテンツ */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            人気の映画
          </h2>
          <p className="text-gray-600">
            次に観る映画をサクッと見つけよう
          </p>
        </div>

        {/* 映画グリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              critic={getCriticQuote(movie.title)}
            />
          ))}
        </div>

        {/* 追加読み込みインジケーター */}
        {isLoadingMore && (
          <LoadingIndicator text="さらに読み込み中..." />
        )}

        {/* 終了メッセージ */}
        {!hasMore && movies.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              すべての映画を表示しました
            </p>
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