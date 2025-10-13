import './globals.css'

export const metadata = {
  title: 'Movie App',
  description: '映画アプリ',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}

