import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '映画紹介アプリ - 次に観る映画をサクッと見つけよう',
  description: '人気映画を簡単に検索・発見できる映画紹介アプリ。TMDB APIを使用して最新の映画情報を提供します。',
  keywords: ['映画', '映画検索', '映画紹介', 'TMDB', '人気映画'],
  authors: [{ name: '映画紹介アプリ' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

