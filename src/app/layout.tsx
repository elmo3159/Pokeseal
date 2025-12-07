import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ポケシル - ポケットシールちょう',
  description: 'デジタルシール帳でシールを集めて、貼って、交換しよう！',
  keywords: ['シール', 'シール帳', 'コレクション', 'ガチャ', '交換'],
  authors: [{ name: 'Pokeseal Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ポケシル',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#A78BFA',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        {/* Google Fonts - 丸みのある可愛らしいフォント */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Kosugi+Maru&family=M+PLUS+Rounded+1c:wght@300;400;500;700;800&family=Zen+Maru+Gothic:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
