import { Suspense } from 'react'
import MovieCard from "@/components/MovieCard"
import SkeletonCard from "@/components/SkeletonCard"
import ErrorBlock from "@/components/ErrorBlock"
import Header from "@/components/Header"

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

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

async function SearchResults({ query }: { query: string }) {
  try {
    // サーバーサイドで直接TMDB APIを呼び出し
    const baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3'
    const apiKey = process.env.TMDB_API_KEY
    
    if (!apiKey) {
      throw new Error('TMDB_API_KEY is not configured')
    }

    // 日本語で検索を試す
    let searchUrl = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=ja-JP&include_adult=false&page=1`
    let response = await fetch(searchUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 300 }
    })
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }
    
    let data = await response.json()
    
    // 日本語で結果が見つからない場合、英語でも検索を試す
    if (data.results.length === 0 && /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(query)) {
      searchUrl = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&include_adult=false&page=1`
      response = await fetch(searchUrl, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 300 }
      })
      
      if (response.ok) {
        data = await response.json()
      }
    }

    if (data.results.length === 0) {
      return (
        <div className="text-center text-gray-600 py-12">
          <p className="text-xl font-semibold mb-4">
            「{query}」の検索結果は見つかりませんでした。
          </p>
          <p>別のキーワードでお試しください。</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.results.map((movie) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            critic={getCriticQuote(movie.title)}
          />
        ))}
      </div>
    )
  } catch (error) {
    return (
      <ErrorBlock 
        message="検索に失敗しました"
      />
    )
  }
}

interface SearchPageProps {
  searchParams: {
    q?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <Header />

      {/* メインコンテンツ */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          {query ? `「${query}」の検索結果` : "映画を検索"}
        </h2>

        {query ? (
          <Suspense fallback={<SearchSkeleton />}>
            <SearchResults query={query} />
          </Suspense>
        ) : (
          <div className="text-center text-gray-600 py-12">
            <p className="text-xl font-semibold mb-4">
              検索バーにキーワードを入力して映画を探しましょう。
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